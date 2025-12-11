### Prompt

I am planning to build a tool that reminds of new job postings on a list of small scale early startups.
I am a software engineer, I am interested in engineering jobs either backend or fullstack or team lead etc.
It is difficult to find good quality matches on linkedin or other sites.
These niche startups usually hire through other mediums but they always list the job openings on their websites under careers section.

The tool will be built on top of Cloudflare.
I want to use their browser rendering APIs and products.
These APIs allow to take screenshot of a web page, render as pdf, scrape html elements, capture structured data as json using AI, retrieve links from a page, extract markdown etc.
I'll maintain an internal database of job openings and send out an email of curated jobs every week to myself.
The list of web pages to crawl periodically for new openings will be static in the beginning.
Do you think this tool would help me find my next job? How do you think abou this idea in terms of both feasability and usefulness?


### Assumptions

1. We have a list of career pages to crawl
2. Each career page has a list of jobs
3. Based on the title of the job link, the crawler should decide whether we should take it or leave it
4. If the link was already processed, no need to process again
5. Crawler runs once a week

### Crawler

`POST https://api.cloudflare.com/client/v4/accounts/a6003e408a448be5fcc801b316519998/browser-rendering/json`

```json
{
    "url": "https://duckduckgo.com/hiring",
    "prompt": "Give me a list of job postings on this page, include the title and url of each job. I only care about senior roles in engineering positions.",
    "gotoOptions": {
        "waitUntil": "networkidle0"
    },
    "response_format": {
        "type": "json_schema",
        "schema": {
            "properties": {
                "jobs": {
                    "items": {
                        "properties": {
                            "url": {
                                "type": "string"
                            },
                            "title": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "url",
                            "title"
                        ],
                        "type": "object"
                    },
                    "type": "array"
                }
            },
            "type": "object"
        }
    }
}
```

### Workflow

1. Cron job triggers worker
2. Worker starts workflow
3. Workflow has steps for each company

### Database

* Cloudflare D1 (sqlite)
* No support for transactions
* You can query local db with `npx wrangler d1 execute job_hunter --command "select * from job;" --local`

#### Prisma

Create initial migration

```bash
npx wrangler d1 migrations create job_hunter init_tables

npx prisma migrate diff \
  --from-empty \
  --to-schema ./prisma/schema.prisma \
  --script \
  --output migrations/0001_init_tables.sql
```

Apply the migration to local db

```bash
npx wrangler d1 migrations apply job_hunter --local
```

If you need to drop the local db and start fresh

```bash
rm -rf .wrangler/state
npx wrangler d1 migrations apply job_hunter --local
```
