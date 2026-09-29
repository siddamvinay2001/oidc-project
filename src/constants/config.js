export default {
  clients: [
    {
      client_id: "vin-client-1",
      client_secret: "vin-secret-1",
      grant_types: ["refresh_token", "authorization_code"],
      redirect_uris: ["https://oidcdebugger.com/debug"],
    },
  ],
  claims: {
    opeid: ["sub"],
    email: ["email"],
    profile: ["name"],
  },
  interactions:{
    url(ctx, interaction){
        return '/interaction/' + interaction.uid;
    }
  }
};
