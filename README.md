# FlowTasks (ADHD-friendly Task + Reminder + Adaptive Calendar MVP)

Production-ready MVP using one Google Cloud/Firebase project.

## Monorepo structure

- `apps/web` - Next.js TypeScript PWA UI
- `services/api` - Cloud Run Express API
- `packages/shared` - zod schemas + shared types
- `packages/scheduler` - deterministic scheduling engine + tests
- `packages/ai/system_prompt.txt` - ADHD coaching system prompt
- `infra` - deployment scripts
- `scripts/seed.ts` - demo seed script

## 1) Prerequisites

- Node.js 20+
- gcloud CLI
- Firebase CLI
- One GCP project with Firebase enabled

## 2) Enable required Google APIs

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com firestore.googleapis.com cloudscheduler.googleapis.com firebase.googleapis.com iamcredentials.googleapis.com
```

In Firebase console:
- Enable Authentication providers: Email/Password and Phone
- Enable Firestore (Native mode)
- Enable Cloud Messaging

## 3) Install dependencies

```bash
npm install
```

## 4) Configure env files

```bash
cp services/api/.env.example services/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Set API URL and Firebase web config values.

## 5) Firestore deploy

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## 6) Run locally

> Workspace packages (`@flowtasks/shared`, `@flowtasks/scheduler`) are resolved from `src` during `dev`, so you do not need to pre-build those packages before starting the API.

Terminal A:
```bash
npm run -w @flowtasks/api dev
```

Terminal B:
```bash
npm run -w @flowtasks/web dev
```

If Next.js ever throws missing chunk errors like `Cannot find module "./295.js"` from `.next/server/webpack-runtime.js`, clear the Next build cache and restart:
```bash
npm run -w @flowtasks/web clean
npm run -w @flowtasks/web dev
```

## 7) Deploy API to Cloud Run

```bash
CRON_SECRET='strong-secret' ./infra/deploy-cloud-run.sh <PROJECT_ID> us-central1
```

## 8) Create Cloud Scheduler jobs

Replace `<SERVICE_URL>` and `<PROJECT_ID>`.

Every 10 min reminders dispatcher:
```bash
gcloud scheduler jobs create http flowtasks-reminders-dispatch \
  --project=<PROJECT_ID> --location=us-central1 \
  --schedule="*/10 * * * *" --http-method=POST \
  --uri="<SERVICE_URL>/v1/jobs/dispatchReminders" \
  --headers="x-cron-secret=strong-secret"
```

Every 30 min missed rescheduler:
```bash
gcloud scheduler jobs create http flowtasks-reschedule-missed \
  --project=<PROJECT_ID> --location=us-central1 \
  --schedule="*/30 * * * *" --http-method=POST \
  --uri="<SERVICE_URL>/v1/jobs/rescheduleMissed" \
  --headers="x-cron-secret=strong-secret"
```

Daily 6:00 AM autoplan:
```bash
gcloud scheduler jobs create http flowtasks-autoplan-today \
  --project=<PROJECT_ID> --location=us-central1 \
  --schedule="0 6 * * *" --time-zone="America/New_York" --http-method=POST \
  --uri="<SERVICE_URL>/v1/jobs/autoplanToday" \
  --headers="x-cron-secret=strong-secret"
```

## 9) Seed demo data

```bash
GOOGLE_CLOUD_PROJECT=<PROJECT_ID> npm run seed -- demo-user
```

## API Endpoints

Authenticated routes (Firebase ID token Bearer):
- `POST /v1/tasks`
- `PATCH /v1/tasks/:id`
- `POST /v1/tasks/:id/complete`
- `POST /v1/tasks/:id/snooze`
- `POST /v1/plan/autoplanDay`
- `POST /v1/plan/reflowDay`
- `POST /v1/plan/rescheduleMissed`
- `POST /v1/ai/parseTask`
- `POST /v1/devices/register`

Cron routes (shared secret header):
- `POST /v1/jobs/dispatchReminders`
- `POST /v1/jobs/rescheduleMissed`
- `POST /v1/jobs/autoplanToday`

## Firestore data model

Collections implemented: `users`, `calendars`, `tasks`, `events`, `reminders`, `devices` with required fields in API/seed flows.

## Tests

```bash
npm run -w @flowtasks/scheduler test
npm run -w @flowtasks/api test
```
