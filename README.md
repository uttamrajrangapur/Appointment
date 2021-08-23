# Appointments App

This App is used to make appointments across different timezones.

## Features

- See the free slots that are available for appointments
- Book a particular slot
- See all the appointments between a date range
## Installation
### Requirements
```
node v10.24.1
npm 6.14.12
yarn 1.22.5
```
### Steps


```
git clone https://github.com/uttamrajrangapur/Appointment
cd Appointment
yarn install
node backend/app.js
```

## API
- GET free slots API
```
    curl --location --request GET 'http://3.86.194.237:3000/api/free_slots?date=2021-08-25&timezone=America/Los_Angeles'
```

- Create a booking API
```
    curl --location --request PUT 'http://3.86.194.237:3000/api/events' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "dateTime":    "2021-08-25T10:30:00-07:00",
        "duration": 1800000
    }'
```

- Get booked Slots API
```
    curl --location --request GET 'http://3.86.194.237:3000/api/events?startDate=2021-08-25T00:31:00.000Z&endDate=2021-08-25T23:00:00.000Z'
```

## Tech Stack
This App uses the following
- Nodejs - Backend
- Firestore - Nosql database
- ExpressJs - Framework
- Joi - Request Schema Validation

## Design
This database contains only one collection called events with the below schema
```
    document_id - uuid
    document_body:
    {
      date: date.format('YYYY-MM-DD'),
      startTime: date,
      endTime: date,
    }
```
and includes two queries.One for creating an event and another for fetching events for a date range.

## License

MIT