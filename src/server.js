import express from "express";
import * as oidc from "oidc-provider";
import configuration from "./constants/config.js";
import interactionRoutes from "./routes/interaction.js";
import ordersRoutes from "./routes/orders.js";
import billingRoutes from "./routes/billing.js";

const ISSUER_URL = process.env.ISSUER_URL || "http://localhost";
const { PORT = 3000, ISSUER = ISSUER_URL + `:${PORT}` } = process.env;

const app = express();

export const provider = new oidc.Provider(ISSUER, configuration);

app.use("/interaction", interactionRoutes(provider));
app.use('/orders', ordersRoutes(ISSUER));
app.use("/billing", billingRoutes(ISSUER));

app.use(provider.callback());

app.use((err, req, res, next) => {
  console.error(err);
  return res
    .status(err.statusCode || err.status || 500)
    .send(
      `<h2>Something went wrong internally, please try again</h2>`
    );
});

app.listen(PORT, () => {
  console.log("Issuer is running at: " + ISSUER);
  console.log(
    "Discovery endpoint: " + ISSUER + "/.well-known/openid-configuration"
  );
  console.log("JWKS endpoint: " + ISSUER + "/jwks");
});
