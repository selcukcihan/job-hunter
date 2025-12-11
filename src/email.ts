import Mailgun from 'mailgun.js';
import { Job } from './generated/prisma/client';
import { Company } from '../companies';
import {
	NO_JOBS_TEXT,
	NO_JOBS_HTML,
	JOBS_EMAIL_HEADER_TEXT,
	JOBS_EMAIL_INTRO_TEXT,
	JOBS_EMAIL_HTML_START,
	JOBS_EMAIL_HTML_END,
} from './email-templates';

export const sendEmail = async (to: string, subject: string, text: string, html: string, mailgunApiKey: string) => {
	const mailgun = new Mailgun(FormData);

	const mg = mailgun.client({ username: 'api', key: mailgunApiKey, url: 'https://api.eu.mailgun.net', useFetch: true });

	console.log('Sending email to ', to);
	try {
		const response = await mg.messages.create('job-hunter.selcukcihan.com', {
			from: 'Job Hunter <no-reply@job-hunter.selcukcihan.com>',
			to: [to],
			subject: subject,
			text: text,
			html: html,
		});
		console.log('Email sent successfully', response);
	} catch (error) {
		console.error('Error sending email', error);
	}
};

export const formatEmail = (jobs: Job[], companies: Company[]) => {
	// Handle the case when there are no new jobs
	if (jobs.length === 0) {
		return { text: NO_JOBS_TEXT, html: NO_JOBS_HTML };
	}

	// Create a map of company name to Company object for quick lookup
	const companyMap = new Map<string, Company>();
	for (const company of companies) {
		companyMap.set(company.name, company);
	}

	// Group jobs by company name
	const jobsByCompany = new Map<string, Job[]>();
	for (const job of jobs) {
		if (!jobsByCompany.has(job.company)) {
			jobsByCompany.set(job.company, []);
		}
		jobsByCompany.get(job.company)!.push(job);
	}

	// Sort companies alphabetically
	const sortedCompanyNames = Array.from(jobsByCompany.keys()).sort();

	// Build text email content
	let emailContent = JOBS_EMAIL_HEADER_TEXT;
	emailContent += JOBS_EMAIL_INTRO_TEXT;

	// Build HTML email content
	let htmlContent = JOBS_EMAIL_HTML_START;

	// Process each company
	for (const companyName of sortedCompanyNames) {
		const companyJobs = jobsByCompany.get(companyName)!;
		const company = companyMap.get(companyName);

		// Sort jobs alphabetically by title
		companyJobs.sort((a, b) => a.title.localeCompare(b.title));

		// Add company section to text
		if (company) {
			emailContent += `${company.name} (${company.url})\n`;
		} else {
			emailContent += `${companyName}\n`;
		}
		emailContent += '─'.repeat(50) + '\n';

		// Add company section to HTML
		htmlContent += '		<div class="company-section">\n';
		htmlContent += '			<div class="company-header">\n';
		if (company) {
			htmlContent += `				${company.name}<a href="${company.url}" class="company-url">${company.url}</a>\n`;
		} else {
			htmlContent += `				${companyName}\n`;
		}
		htmlContent += '			</div>\n';
		htmlContent += '			<div class="separator"></div>\n';
		htmlContent += '			<ul class="job-list">\n';

		// Add job list
		for (const job of companyJobs) {
			emailContent += `  • ${job.title} - ${job.url}\n`;
			htmlContent += `				<li class="job-item"><a href="${job.url}" class="job-link">${job.title}</a></li>\n`;
		}

		emailContent += '\n';
		htmlContent += '			</ul>\n';
		htmlContent += '		</div>\n';
	}

	htmlContent += JOBS_EMAIL_HTML_END;

	return { text: emailContent, html: htmlContent };
};
