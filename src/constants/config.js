import fs from 'fs'
import { findAccount } from '../service/authenticate.js';

const jwks = JSON.parse(fs.readFileSync('keys/jwks.json', 'utf8'));

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

  claims: {
    openid: ["sub"],
    email: ["email"],
    profile: ["name"],
  },
  interactions:{
    url(ctx, interaction){
        return '/interaction/' + interaction.uid;
    }
  },

   features: {
    devInteractions: { enabled: false },
    userinfo: { enabled: true },
  },

  findAccount: findAccount,

   cookies:{
    keys: ['oidc-cookie']
   }

};
