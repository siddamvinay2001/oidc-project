import express from "express";
import * as oidc from "oidc-provider";
import configuration from "./constants/config.js";
import interactionRoutes from './routes/interaction.js'

const ISSUER_URL = process.env.ISSUER_URL || "http://localhost";
const { PORT = 3000, ISSUER = ISSUER_URL + `:${PORT}` } = process.env;

const app = express();

export const provider = new oidc.Provider(ISSUER, configuration);

app.use('/interaction', interactionRoutes);

app.use(provider.callback());

app.use((err,req,res)=>{
    console.error(err);
    return res.status(err.statusCode || err.status || 500).send(
        `<h2>Something went wrong internally <p> ${JSON.stringify(err)} </p></h2>`
    )
})

app.listen(PORT, () => {
  console.log("Server is running at: " + PORT);
});
