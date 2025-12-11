// Static email templates and content

export const NO_JOBS_TEXT = `Ooops, no new jobs for you this week but don't fret! 😅

The job market is like a box of chocolates - sometimes you get the good ones, sometimes you get... well, nothing. But hey, at least we're still checking for you!

Here's a joke to brighten your day:
Why don't programmers like nature? It has too many bugs! 🐛

Don't worry though, we'll keep hunting and you'll be the first to know when something exciting comes up. Your dream job is out there, probably just taking a coffee break. ☕

Stay tuned for next week's update! 🚀

---
Job Hunter Bot 🤖`;

export const NO_JOBS_HTML = `
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
		.content {
			margin-bottom: 20px;
		}
		.content p {
			margin: 15px 0;
			color: #333333;
			font-size: 14px;
		}
		.joke {
			background-color: #f5f5f5;
			border-left: 4px solid #0066cc;
			padding: 15px;
			margin: 20px 0;
			font-style: italic;
		}
		.footer {
			border-top: 1px solid #cccccc;
			padding-top: 20px;
			margin-top: 30px;
			color: #666666;
			font-size: 12px;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>Ooops, no new jobs for you this week but don't fret! 😅</h1>
		</div>
		<div class="content">
			<p>The job market is like a box of chocolates - sometimes you get the good ones, sometimes you get... well, nothing. But hey, at least we're still checking for you!</p>
			<div class="joke">
				<p><strong>Here's a joke to brighten your day:</strong><br>
				Why don't programmers like nature? It has too many bugs! 🐛</p>
			</div>
			<p>Don't worry though, we'll keep hunting and you'll be the first to know when something exciting comes up. Your dream job is out there, probably just taking a coffee break. ☕</p>
			<p>Stay tuned for next week's update! 🚀</p>
		</div>
		<div class="footer">
			Job Hunter Bot 🤖
		</div>
	</div>
</body>
</html>
`;

export const JOBS_EMAIL_HEADER_TEXT = 'Welcome to your weekly job digest! 🎉\n\n';
export const JOBS_EMAIL_INTRO_TEXT = 'Here are the latest engineering opportunities we found for you:\n\n';

export const JOBS_EMAIL_HTML_START = `
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

export const JOBS_EMAIL_HTML_END = `
	</div>
</body>
</html>
`;
