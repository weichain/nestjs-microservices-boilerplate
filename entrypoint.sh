#!/bin/sh

echo "Starting entrypoint.sh"
echo "PRISMA_PUSH: $PRISMA_PUSH"
echo "MAIN_DATABASE_URI: $MAIN_DATABASE_URI"
echo "NODE_ENV: $NODE_ENV"


if [ "$PRISMA_PUSH" = "true" ]; then
  pnpm prisma:push
fi

pnpm start:all
