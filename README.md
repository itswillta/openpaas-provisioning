# OpenPaaS Provisioning

This repository aims to provide provisioning stuff for OpenPaaS via API requests.

## Provisining Instructions

Before doing anything, you need to create an `.env` file with the following environment variables (you can copy from):

```env
OPENPAAS_URL=http://localhost:8080
PLATFORM_ADMIN_USERNAME=admin@open-paas.org
PLATFORM_ADMIN_PASSWORD=secret
```

- `OPENPAAS_URL` (optional): The url to the OpenPaaS web server (the default value is `http://localhost:8080`).
- `PLATFORM_ADMIN_USERNAME` (required): The username of the platform admin.
- `PLATFORM_ADMIN_PASSWORD` (required): The password of the platform admin.

### User Provisioning

The following command will create a domain and fill it with auto-generated users. After the users have been created, it will generate a CSV file in the **output** folder with the list of user accounts.

```bash
node scripts/createDomainWithMembers.js --domainAdminEmail=admin@gatling-cal10.org --numOfUsers=4000
```

- `domainAdminEmail` (required): The email for the new domain admin. The script will take the email domain in this email as the name for the new domain.
- `domainAdminPassword` (optional): The account password for the new domain (the default value is `secret`).
- `numOfUsers` (optional): The number of users that are going to be created (the default value is `100`).

### Event Provisioning

The following command will generate a random number of events in the default calendar for each user account listed in a CSV file:

```bash
node scripts/generateRandomEventsForUsers --csvFilename=users-2020-11-12-17-49-6.csv --minNumOfEvents=2 --maxNumOfEvents=5
```

- `csvFilename` (required): The CSV filename in the **output** folder that contains the list of user accounts.
- `minNumOfEvents` (optional): The min number of events that are going to be randomly generated (the default value is `2`).
- `maxNumOfEvents` (optional): The max number of events that are going to be randomly generated (the default value is `5`).
