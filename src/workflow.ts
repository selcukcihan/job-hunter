import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep, WorkflowStepConfig } from 'cloudflare:workers';
import { Companies, Company } from '../companies';
import { PrismaClient } from './generated/prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { scrapeJobs } from './browser';
import { getJobsThatHaveNotBeenEmailed, JobWithoutCrawlResult, storeCrawlResult, storeJobs } from './data';
import { formatEmail, sendEmail } from './email';

const stepConfig: WorkflowStepConfig = {
	retries: {
		limit: 2,
		delay: 20000,
		backoff: 'constant',
	},
	timeout: '60 seconds',
};

export default class CrawlerWorkflow extends WorkflowEntrypoint<Env, Params> {
	async crawlCompany(prisma: PrismaClient, step: WorkflowStep, company: Company) {
		console.log('Crawling company: ', company.name);
		let jobs: JobWithoutCrawlResult[] = [];
		let response: any = null;
		try {
			const result = await step.do(`crawl company ${company.name}`, stepConfig, () => scrapeJobs(company, this.env.CLOUDFLARE_API_KEY));
			jobs = result.jobs;
			response = result.response;
		} catch (error) {
			console.error('Error crawling company: ', company.name, error);
		}
		if (jobs.length > 0) {
			const crawlResultId = await step.do(`store crawl result for company ${company.name}`, () =>
				storeCrawlResult(prisma, company, response)
			);
			await step.do(`store jobs for company ${company.name}`, () => storeJobs(prisma, company, jobs, crawlResultId));
		}
		await step.sleep('wait for rate limit', '10 seconds');
		console.log('CrawlerWorkflow finished company: ', company.name);
	}

	async sendEmail(prisma: PrismaClient) {
		const jobs = await getJobsThatHaveNotBeenEmailed(prisma);
		const { text, html } = formatEmail(jobs, Companies);
		const title = `Found ${jobs.length} new jobs for you`;
		await sendEmail('selcukcihan+jobhunter@gmail.com', title, text, html, this.env.MAILGUN_API_KEY);
	}

	async run(event: Readonly<WorkflowEvent<Params>>, step: WorkflowStep) {
		console.log('CrawlerWorkflow started');
		const adapter = new PrismaD1(this.env.DB);
		const prisma = new PrismaClient({ adapter });
		for (const company of Companies) {
			// await this.crawlCompany(prisma, step, company);
		}
		await step.do(`send email`, () => this.sendEmail(prisma));
		console.log('CrawlerWorkflow finished');
	}
}
