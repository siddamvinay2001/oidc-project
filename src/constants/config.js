import fs from "fs";
import { findAccount } from "../service/authenticate.js";
import { errors } from "oidc-provider";

const jwks = JSON.parse(fs.readFileSync("keys/jwks.json", "utf8"));

const cookieKeys = process.env.COOKIES
  ? process.env.COOKIES.split(",")
  : ["cookie-keys"];

const RESOURCE_SERVERS = {
  "http://localhost:3000/orders": {
    audience: "http://localhost:3000/orders",
    scope: "orders:read",
    accessTokenFormat: "jwt",
    accessTokenTTL: 3600,
    jwt: { sign: { alg: "RS256" } },
  },
  "http://localhost:3000/billing": {
    audience: "http://localhost:3000/billing",
    scope: "billing:read",
    accessTokenFormat: "jwt",
    accessTokenTTL: 600,
    jwt: { sign: { alg: "RS256", kid: "key-1" } },
  },
};

export default {
  clients: [
    {
      client_id: "vin-client-1",
      client_secret: "vin-secret-1",
      grant_types: ["refresh_token", "authorization_code"],
      redirect_uris: ["https://oidcdebugger.com/debug"],
    },
  ],

  jwks: jwks,
  // rotateRefreshToken: true, rotate every refresh call

  claims: {
    openid: ["sub"],
    email: ["email"],
    profile: ["name"],
  },
  interactions: {
    url(ctx, interaction) {
      return "/interaction/" + interaction.uid;
    },
  },

  features: {
    devInteractions: { enabled: false },
    userinfo: { enabled: true },
    resourceIndicators: {
      enabled: true,
      //access token can grant to only one sub
      defaultResource: (ctx, client, oneOf) => {
        if (oneOf) return oneOf[0];
        return undefined; // in case of no resource mentioned we need opaque tokens
      },
      useGrantedResource: () => true,
      getResourceServerInfo: (ctx, resourceIndicator, client) => {
        const info = RESOURCE_SERVERS[resourceIndicator];
        if (!info) throw new errors.InvalidTarget();
        return info;
      },
    },
  },

  findAccount,
  cookies: {
    keys: cookieKeys,
  },
};
