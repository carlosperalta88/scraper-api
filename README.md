# Scraper API - Experimental

This API holds the business logic for batch processing and storage scraped data from PJUD.

## Endpoints

All prefix with /v1 snippet

'/cases'
'/courts'
'/scrape'
'/clients'
'/users'
'/roles'
'/cases-data'
'/reports'
'/executions'

## Executing the App

`npm install`

You need to define a `variables.env` file on root with the following variables
```
API_KEY
SQS_Send
SQS_Receive
PROFILE
REGION
UPPER_LIMIT
DB_URI
SCRAPER_URL
REPORT_URL
```
`npm start:dev`

## Testing

Is not 100% coverage for unit test but most of the core is cover so far.
