# Node.js OIDC Identity Provider

A small OpenID Connect Identity Provider built with Node.js, Express and
[oidc-provider](https://github.com/panva/node-oidc-provider). It supports the
Authorization Code Flow, issues an signed ID Token, exposes Discovery and
JWKS, and the ID Token can be verified on [jwt.io](https://www.jwt.io/).

## Architecture
<img src="docs/architecture.png" alt="Authorization Code Flow" width="800">

## Requirements

- Node.js 20.6 or newer (uses `--env-file`)

## Setup and Start

```bash
npm install
npm run gen-keys          # creates keys/jwks.json (RSA 2048, kid: key-1)
cp .env.example .env      # then set COOKIES to a random value
npm start
```

`.env` variables:

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Port to listen on | `3000` |
| `ISSUER_URL` | Issuer base URL (port is appended) | `http://localhost` |
| `COOKIES` | Comma-separated cookie signing keys (first signs, all verify) | `randomKey1,randomKey2` |

Generate a cookie key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Endpoints

With the default `.env` (`http://localhost:3000`):

| Endpoint | URL |
|---|---|
| Discovery | http://localhost:3000/.well-known/openid-configuration |
| JWKS (public keys only) | http://localhost:3000/jwks |
| Authorization | http://localhost:3000/auth |
| Token | http://localhost:3000/token |
| UserInfo | http://localhost:3000/me |

All endpoint URLs are also listed in the discovery document.

## Test User

In-memory user, defined in `src/service/authenticate.js`:

| Username | Password | Email | Name |
|---|---|---|---|
| `portainer` | `portainer123` | portainer@example.com | Portainer Io |

## Configured Client

Defined in `src/constants/config.js`:

| Setting | Value |
|---|---|
| `client_id` | `vin-client-1` |
| `client_secret` | `vin-secret-1` |
| `redirect_uri` | `https://oidcdebugger.com/debug` |
| `response_type` | `code` |
| `grant_types` | `authorization_code`, `refresh_token` |
| Scopes | `openid` (gives `sub`), `email`, `profile` (gives `name`), `offline_access` |

## Reproduce the Login Flow (OIDC Debugger)

### 1. Start the provider

```bash
npm start
```

### 2. Request an authorization code

Open https://oidcdebugger.com and fill in:

| Field | Value |
|---|---|
| Authorize URI | `http://localhost:3000/auth` |
| Redirect URI | `https://oidcdebugger.com/debug` |
| Client ID | `vin-client-1` |
| Scope | `openid email profile` |
| Response type | `code` |
| Response mode | `form_post` | `code_verifier` optional |

### 3. Log in and consent

1. Sign in with `portainer` / `portainer123`.
2. Click **Allow** on the consent page.
3. OIDC Debugger shows the **authorization code**.

### 4. Exchange the code for tokens

```bash
curl -X POST http://localhost:3000/token \
  -u vin-client-1:vin-secret-1 \
  -d grant_type=authorization_code \
  -d code=<AUTHORIZATION_CODE> \
  -d redirect_uri=https://oidcdebugger.com/debug
```

Add `-d code_verifier=<VERIFIER>` if PKCE was used.

### 5. Call UserInfo

```bash
curl http://localhost:3000/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Returns `sub`, `email` and `name`, based on the granted scopes.

### JWT access tokens (branch `scartch/optionals`)

Resource Indicators (RFC 8707) with two demo APIs, `/orders` and `/billing`. Each access token is a JWT bound to one API through `aud`, which shows how its audience differs from the ID Token's (the client).

## Project Structure

```
src/
  server.js               Express app, mounts interaction routes and the provider
  constants/config.js     oidc-provider config: client, claims, keys, cookies, features
  routes/interaction.js   Login and consent routes
  service/authenticate.js In-memory user store and findAccount
  views/pages.js          Login and consent HTML
scripts/
  generate-keys.js        Creates or adds an RSA signing key in keys/jwks.json
keys/                     Private signing keys (git-ignored)
```