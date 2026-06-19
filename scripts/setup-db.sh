#!/bin/bash
set -e

# Tạo database elsaco nếu chưa có
# User: postgres | Password: test1234 | DB: elsaco
export PGPASSWORD=test1234
psql -U postgres -h localhost -tc "SELECT 1 FROM pg_database WHERE datname='elsaco'" | grep -q 1 \
  || psql -U postgres -h localhost -c "CREATE DATABASE elsaco;"

echo "Database elsaco ready."
