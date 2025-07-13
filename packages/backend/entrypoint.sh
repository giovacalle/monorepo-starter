#!/bin/sh

if [ -n "${PB_ENCRYPTION_KEY}" ]; then
  exec /pb/pocketbase serve --http="0.0.0.0:8080" --encryptionEnv="${PB_ENCRYPTION_KEY}"
else
  exec /pb/pocketbase serve --http="0.0.0.0:8080"
fi