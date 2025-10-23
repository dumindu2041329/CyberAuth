# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Serve locally (from repo root):
  - PHP built-in server: `php -S 127.0.0.1:8000 -t .`
  - Then hit endpoints like: `http://127.0.0.1:8000/api/signup.php` and `/api/login.php`

- Initialize database schema (creates `cyberauth_db` and `users` table):
  - Using MySQL CLI: `mysql -u root -p < config/setup.sql`

- Lint PHP (PowerShell):
  - All files: `Get-ChildItem -Recurse -Filter *.php | % { php -l $_.FullName }`
  - Single file: `php -l api/login.php`

- Manual endpoint checks (no test framework configured):
  - Health (should return 405 for GET): `curl -i http://127.0.0.1:8000/api/login.php`
  - Sign up:
    `curl -X POST -H "Content-Type: application/json" -d '{"username":"alice","email":"alice@example.com","password":"secret123"}' http://127.0.0.1:8000/api/signup.php`
  - Login:
    `curl -X POST -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"secret123"}' http://127.0.0.1:8000/api/login.php`

## Architecture & Structure

- API endpoints (`api/*.php`): Standalone PHP scripts that:
  - Enforce CORS and JSON responses; handle `OPTIONS` preflight and restrict to `POST` with 405 otherwise.
  - Accept JSON via `php://input`, validate required fields, and return JSON with appropriate HTTP status codes (200/201/400/401/405/409/500).
  - Use prepared statements and parameter binding against MySQL.

- Database access (`config/database.php`):
  - `getDBConnection()`/`closeDBConnection()` helpers using `mysqli` with constants `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`.

- Schema (`config/setup.sql`):
  - Creates `cyberauth_db` and a `users` table: `id`, `username` (unique), `email` (unique), `password` (bcrypt hash), timestamps, and indexes on `email` and `username`.

- Auth flow specifics:
  - Sign up (`api/signup.php`): validates inputs, enforces uniqueness, hashes passwords with `password_hash(..., PASSWORD_BCRYPT, ['cost' => 12])`, returns created user metadata.
  - Login (`api/login.php`): retrieves by email, verifies password via `password_verify`, returns user metadata on success.

- Adding new endpoints (follow existing pattern):
  - Include `config/database.php`, set CORS/headers, check method, parse/validate JSON, use prepared statements, return JSON and proper HTTP codes.
