#!/usr/bin/env bash
set -euo pipefail
PROJECT_ID="$1"
REGION="${2:-us-central1}"
SERVICE="flowtasks-api"

gcloud config set project "$PROJECT_ID"
gcloud run deploy "$SERVICE" \
  --source services/api \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "CRON_SECRET=${CRON_SECRET:-replace-me}"
