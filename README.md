# Creator-Card-Microservice-API

Backend microservices for **Creator-card**—an API built with **the17thstudio** framework, as solution for **[assessment-2.md](./assessment-2.md)** The API can creates, retrieve, or delete creator's card. Implemented are; validation of credentials, persistence of application payloads, Specs examoles, and swagger documentation, and tests for edge cases.

## Stack

- **Node.js**, **Express**
- **MongooDB** (application data: card form submissions)

## Requirements

- **Node.js** and **npm**
- A running **MongoDB** instance

## Configuration

```` bash
 cp .env.example .env
````
Edit `.env` file and configure required variable:
````bash
# Local server Configuration
PORT=3000
APP_BASE_URL=http://localhost:3000
APP_NAME=creator-card-microservice

# Local database
MONGODB_URI=mongodb://localhost:27017/creator_card_db
````


## Run locally

```bash
npm install
npm start
```

Other script:

- `npm test` — Mocha
- `npm sync-envs` - sync environment files

## API
The API is remotely deployed to https://creator-card-microservice-api-gbsw.onrender.com

Base path: **`/`**.

| Method | Path |
|---|---|
| POST | `/creator-cards` |
| GET | `/creator-cards/:slug` |
| DELETE | `/creator-cards/:slug` |

Request/response shapes and examples are defined in **[specs/](./specs)**

```
├── app.js                    # Entry point
├── bootstrap.js              # App initialization
├── core/                     # @app-core modules
│   ├── errors/
│   ├── jwt/
│   ├── logger/
│   ├── mongoose/
│   ├── security/
│   ├── validator/
│   └── ...
├── endpoints/                # API routes
│   ├── card-management/ 
|   |-- identity-management/
│   ├── account-management/
│   └── admin/
├── services/                # Business logic
│   |-- card-management/
|   |── identity-management/
│   ├── account-management/
│   └── utils/
├── models/                   # Mongoose schemas
├── repository/               # Data access layer
├── middlewares/              # Request interceptors
├── messages/                 # Error messages
├── specs/                    # Validation specs
│   └── [servicegroup]/
│       ├── data/
│       └── endpoint/
└── docs/                     # Documentation
```

## License

ISC (see `package.json`).
