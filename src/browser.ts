import Cloudflare from 'cloudflare';
import { Company } from '../companies';
import { JobWithoutCrawlResult } from './data';

interface JobsWithResponse {
	jobs: JobWithoutCrawlResult[];
	response: any;
}

export const scrapeJobs = async (company: Company, cloudflareApiKey: string): Promise<JobsWithResponse> => {
	console.log(`Scraping jobs from ${company.board}`);
	const client = new Cloudflare({
		apiToken: cloudflareApiKey,
	});
	const response = await client.browserRendering.json.create({
		url: company.board,
		prompt: `Give me a list of job postings on this page, include the title and url of each job.
			I only care about senior roles in engineering positions.
			Only include jobs with https urls.`,
		gotoOptions: {
			waitUntil: 'networkidle0',
		},
		account_id: 'a6003e408a448be5fcc801b316519998',
		response_format: {
			type: 'json_schema',
			json_schema: {
				properties: {
					jobs: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								url: { type: 'string' },
								title: { type: 'string' },
							},
						},
					},
				},
			},
		},
	});
	console.log('response: ', response);

	const jobs = ((response['jobs'] as { url: string; title: string }[]) || []).filter(
		// filter out jobs that have the same url
		(job: any, index: number, self: any) => index === self.findIndex((t: any) => t.url === job.url)
	);
	console.log(`Found ${jobs.length} jobs from ${company.board}`);
	const now = new Date();
	return {
		jobs: jobs.map((job: any) => ({
			url: job.url,
			title: job.title,
			company: company.name,
			createdAt: now,
			updatedAt: now,
			emailedAt: null,
		})),
		response: response as any,
	};
};
