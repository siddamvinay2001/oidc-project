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