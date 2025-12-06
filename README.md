# Blog API (Node.js + Express + Sequelize + PostgreSQL)

_A simple RESTful Blog API that manages authors and posts. Demonstrates modeling a one-to-many relationship (Author → Posts) with proper foreign key constraints, cascade delete, validation, efficient queries, and automated tests._

---

## Table of Contents

- [Overview](#overview)  
- [Tech Stack](#tech-stack)  
- [Repository Structure](#repository-structure)  
- [Database Schema (ERD)](#database-schema-erd)  
- [Environment Variables](#environment-variables)  
- [Quickstart — Docker (recommended)](#quickstart---docker-recommended)  
- [Quickstart — Local (without Docker)](#quickstart---local-without-docker)  
- [API Endpoints (full)](#api-endpoints-full)  
  - [Authors endpoints](#authors-endpoints)  
  - [Posts endpoints](#posts-endpoints)  
- [Example Requests (curl & PowerShell)](#example-requests-curl--powershell)  
- [Migrations & Seeders](#migrations--seeders)  
- [Testing](#testing)  
- [CI (GitHub Actions)](#ci-github-actions)  
- [Postman Collection](#postman-collection)  
- [Submission Checklist & Notes](#submission-checklist--notes)  
- [Troubleshooting](#troubleshooting)  
- [Contact / Support](#contact--support)

---

## Overview

This project implements a REST API to manage:

- **Authors**: `id`, `name`, `email` (unique)  
- **Posts**: `id`, `title`, `content`, `authorId` (foreign key → authors.id)

Key behaviors:
- Creating a post with a non-existent `authorId` returns `4xx` error.
- Deleting an author cascades and deletes their posts (DB-level `ON DELETE CASCADE`).
- `GET /posts` and `GET /posts/:id` return nested author details and fetch author data with a single efficient query (eager loading) to avoid N+1.

---

## Tech Stack

- Node.js 18 (Docker: `node:18-alpine`)  
- Express.js  
- Sequelize ORM (v6)  
- PostgreSQL 15  
- Docker & Docker Compose  
- Jest + Supertest for testing

---

## Repository Structure

.
├─ src/
│ ├─ controllers/ # route handlers
│ ├─ models/ # Sequelize models & associations
│ ├─ migrations/ # Sequelize migrations
│ ├─ seeders/ # Seed data
│ ├─ routes/ # Express routers
│ └─ index.js # app entry (exports app for tests)
├─ tests/ # Jest + Supertest tests
├─ docs/
│ └─ postman_collection.json
├─ .github/workflows/ci.yml
├─ .env.example
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
└─ README.md


---

## Database Schema (ERD - text)

AUTHORS

id (PK, integer, auto-increment)

name (string, not null)

email (string, unique, not null)

createdAt

updatedAt

POSTS

id (PK, integer, auto-increment)

title (string, not null)

content (text, not null)

authorId (FK -> authors.id) ON DELETE CASCADE

createdAt

updatedAt

Relationship:
authors (1) <-- (M) posts


---

## Environment Variables

Copy `.env.example` to `.env` and update values as needed.

Example `.env` content:

NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://postgres:postgres@db:5432/blogdb
TEST_DATABASE_URL=postgres://postgres:postgres@db:5432/blogdb_test


> **Important:** Do not commit `.env`. `.env.example` is included for reference.

---

## Quickstart — Docker (recommended)

1. Copy example env:
```powershell
# PowerShell
Copy-Item .env.example .env

Build and start containers:

docker-compose up --build -d


(If not auto-run) Run migrations & seeders:

docker-compose exec api npx sequelize db:migrate
docker-compose exec api npx sequelize db:seed:all   # optional


App should be available at:

http://localhost:3000


Stop containers:

docker-compose down


Remove DB volume (to clear DB):

docker-compose down -v

Quickstart — Local (without Docker)

Ensure PostgreSQL is installed and running locally.

Create databases:

psql -U postgres -c "CREATE DATABASE blogdb;"
psql -U postgres -c "CREATE DATABASE blogdb_test;"


Set .env to use localhost:

DATABASE_URL=postgres://postgres:postgres@localhost:5432/blogdb
TEST_DATABASE_URL=postgres://postgres:postgres@localhost:5432/blogdb_test


Install and run:

npm install
npx sequelize db:migrate
npx sequelize db:seed:all   # optional
npm run dev

API Endpoints (full)

All endpoints accept/return JSON. Error format: { "error": "message" }

Authors endpoints

POST /authors — Create an author

Body: { "name": "Alice", "email": "alice@example.com" }

Responses: 201 (created), 400 for validation or duplicate email

GET /authors — List all authors

Returns 200 with { value: [...], Count: N }

GET /authors/:id — Get a single author

Returns 200 or 404 if not found

PUT /authors/:id — Update an author

Body: any of { "name", "email" }

Responses: 200 updated, 400 validation, 404 not found

DELETE /authors/:id — Delete author (cascade posts)

Returns 204 on success, 404 if not found

GET /authors/:id/posts — Get all posts for that author

Returns 200 with posts array

Posts endpoints

POST /posts — Create a post

Body: { "title":"T", "content":"C", "authorId": 1 }

Responses: 201 (with nested author) or 400 when authorId doesn't exist or validation fails

GET /posts — List posts (supports filtering)

Query param: ?authorId=1

Returns 200 with nested author for each post (eager-loaded)

GET /posts/:id — Get single post (includes author)

200 or 404

PUT /posts/:id — Update post (title/content)

Returns 200 or 404

DELETE /posts/:id — Delete post

Returns 204 or 404

Example Requests (curl & PowerShell)
curl

Create author:

curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'


List authors:

curl http://localhost:3000/authors


Create post:

curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","authorId":1}'


List posts:

curl http://localhost:3000/posts
curl "http://localhost:3000/posts?authorId=1"

PowerShell (Invoke-RestMethod)

Create author:

Invoke-RestMethod -Uri "http://localhost:3000/authors" -Method Post `
  -Headers @{ 'Content-Type' = 'application/json' } `
  -Body ('{ "name": "Alice", "email": "alice@example.com" }')


Create post:

Invoke-RestMethod -Uri "http://localhost:3000/posts" -Method Post `
  -Headers @{ 'Content-Type' = 'application/json' } `
  -Body ('{ "title":"Hello","content":"World","authorId":1 }')


Delete author (example showing 204):

$response = Invoke-WebRequest -Uri "http://localhost:3000/authors/1" -Method Delete -UseBasicParsing
$response.StatusCode  # should be 204

Migrations & Seeders (Sequelize)

Run migrations:

npx sequelize db:migrate


Undo all:

npx sequelize db:migrate:undo:all


Seed:

npx sequelize db:seed:all


Migration files live in src/migrations/. Seeder files live in src/seeders/.

Testing

Project uses Jest and Supertest.

Run tests inside Docker (recommended)
# ensure test DB exists inside container
docker-compose exec db psql -U postgres -c "CREATE DATABASE blogdb_test;" || true

# run tests (container resolves 'db' hostname)
docker-compose exec api sh -c "TEST_DATABASE_URL=postgres://postgres:postgres@db:5432/blogdb_test NODE_ENV=test npx jest --runInBand --detectOpenHandles"

Run tests locally

Ensure TEST_DATABASE_URL points to a reachable DB

Run:

npm test


Tests included:

tests/posts.test.js

tests/authors.test.js

tests/posts.update.test.js

CI (GitHub Actions)

This repo contains a CI workflow at .github/workflows/ci.yml that:

Boots a PostgreSQL service

Installs Node dependencies

Creates a test DB

Runs migrations

Runs Jest test suite

On push / pull_request to main, CI executes tests.

Postman Collection

A Postman collection is included at docs/postman_collection.json.
Import this file into Postman; it uses {{base_url}} (default http://localhost:3000) as the base URL.

Submission Checklist & Notes

A SUBMISSION.md checklist is included at the repo root. It lists mandatory deliverables for evaluators (code, migrations, seeders, tests, docs, Postman collection, CI).

Make sure:

.env.example exists and .env is in .gitignore.

Tests pass locally and in CI before submission.

Provide the repo link and any special run notes with your submission.


