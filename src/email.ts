import Mailgun from 'mailgun.js';
import { Job } from './generated/prisma/client';
import { Company } from '../companies';

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
	let emailContent = 'Welcome to your weekly job digest! 🎉\n\n';
	emailContent += 'Here are the latest engineering opportunities we found for you:\n\n';

	// Build HTML email content
	let htmlContent = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		body {
			font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
			margin: 0;
			padding: 20px;
			line-height: 1.6;
			color: #333333;
		}
		.container {
			max-width: 800px;
			margin: 0 auto;
			border: 1px solid #e0e0e0;
			border-radius: 6px;
			padding: 30px;
		}
		.header {
			border-bottom: 2px solid #333333;
			padding-bottom: 20px;
			margin-bottom: 30px;
		}
		.header h1 {
			margin: 0;
			color: #0066cc;
			font-size: 24px;
			font-weight: normal;
		}
		.header p {
			margin: 10px 0 0 0;
			color: #666666;
			font-size: 14px;
		}
		.company-section {
			margin-bottom: 30px;
		}
		.company-header {
			color: #cc6600;
			font-size: 18px;
			margin-bottom: 10px;
			font-weight: bold;
		}
		.company-url {
			color: #0066cc;
			font-size: 12px;
			text-decoration: none;
			margin-left: 10px;
		}
		.company-url:hover {
			text-decoration: underline;
		}
		.separator {
			border-top: 1px solid #cccccc;
			margin: 10px 0 15px 0;
		}
		.job-list {
			list-style: none;
			padding: 0;
			margin: 0;
		}
		.job-item {
			margin-bottom: 12px;
			padding-left: 20px;
			position: relative;
		}
		.job-item::before {
			content: '▸';
			position: absolute;
			left: 0;
			color: #0066cc;
		}
		.job-link {
			color: #0066cc;
			text-decoration: none;
			font-size: 14px;
		}
		.job-link:hover {
			color: #004499;
			text-decoration: underline;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>Welcome to your weekly job digest! 🎉</h1>
			<p>Here are the latest engineering opportunities we found for you:</p>
		</div>
`;

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

	htmlContent += `
	</div>
</body>
</html>
`;

	return { text: emailContent, html: htmlContent };
};
