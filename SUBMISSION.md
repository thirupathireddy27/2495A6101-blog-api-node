# Submission Checklist — Blog API (Node.js)

Repository: https://github.com/thirupathireddy27/2495A6101-blog-api-node

## Mandatory
- [ ] Public GitHub repo containing full source code
- [ ] `package.json` and lockfile included
- [ ] Dockerfile & docker-compose.yml included and working
- [ ] `.env.example` present; `.env` listed in .gitignore
- [ ] Sequelize migrations in `src/migrations/`
- [ ] Seeders (optional) in `src/seeders/`
- [ ] Models in `src/models/` and associations implemented
- [ ] Controllers and Routes in `src/controllers/` and `src/routes/`
- [ ] Tests in `tests/` and they pass locally and in CI
- [ ] CI workflow file `.github/workflows/ci.yml` present and green
- [ ] README.md with clear setup instructions (local & Docker), API docs, ERD
- [ ] Postman collection at `docs/postman_collection.json` (optional but included)

## Functionality to verify (for evaluator)
- Author CRUD works (create, get, update, delete)
- Post CRUD works (create with valid authorId, get single with nested author, update, delete)
- Creating a post with non-existent author returns 4xx (400)
- Deleting an author cascades and deletes their posts
- Listing posts returns author data efficiently (no N+1)
- `GET /authors/{id}/posts` returns only that author's posts

## How to run (recommended)
### Docker
1. `Copy-Item .env.example .env` (PowerShell) or `cp .env.example .env`
2. `docker-compose up --build -d`
3. `docker-compose exec api npx sequelize db:migrate`
4. `docker-compose exec api npx sequelize db:seed:all` (optional)
5. API available at `http://localhost:3000`

### Running tests
- Inside API container:
  `docker-compose exec api sh -c "TEST_DATABASE_URL=postgres://postgres:postgres@db:5432/blogdb_test NODE_ENV=test npx jest --runInBand --detectOpenHandles"`

## Notes / Troubleshooting
- If container env not updated after changing `.env`, recreate containers: `docker-compose down && docker-compose up --build -d`
- If getting port or DB connection errors, ensure port 5432 not blocked and Docker is running.

## Contact
If there are problems running the project, provide:
1. `docker-compose ps`
2. `docker-compose logs --tail=200 api`
3. the curl / Postman request+response output
