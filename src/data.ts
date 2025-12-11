import { PrismaClient } from './generated/prisma/client';
import { Company } from '../companies';

export interface JobWithoutCrawlResult {
	url: string;
	title: string;
	company: string;
	createdAt: Date;
	updatedAt: Date;
}

export const getJobsThatHaveNotBeenEmailed = async (prisma: PrismaClient) => {
	const jobs = await prisma.job.findMany({
		where: {
			emailedAt: null,
		},
	});
	return jobs;
};

export const storeCrawlResult = async (prisma: PrismaClient, company: Company, response: any) => {
	const crawlResult = await prisma.crawlResult.create({
		data: {
			url: company.board,
			response,
		},
	});
	return crawlResult.id;
};

export const storeJobs = async (prisma: PrismaClient, company: Company, jobs: JobWithoutCrawlResult[], crawlResultId: number) => {
	// Get all existing job URLs to filter out duplicates (read-only, no transaction needed)
	const existingJobUrls = await prisma.job.findMany({
		where: {
			url: {
				in: jobs.map((job) => job.url),
			},
		},
		select: {
			url: true,
		},
	});

	const existingUrlsSet = new Set(existingJobUrls.map((job) => job.url));
	const newJobs = jobs.filter((job) => !existingUrlsSet.has(job.url));

	// Insert all new jobs in a single batch, linking them to the crawl result
	if (newJobs.length > 0) {
		await prisma.job.createMany({
			data: newJobs.map((job) => ({
				url: job.url,
				title: job.title,
				company: job.company,
				crawlResultId: crawlResultId,
				createdAt: job.createdAt,
				updatedAt: job.updatedAt,
			})),
		});
	}
};
