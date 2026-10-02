import express from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

export default function billingRoutes(issuer) {
  const router = express.Router();
  const jwks = createRemoteJWKSet(new URL(issuer + "/jwks"));

  router.get("/", async (req, res) => {
    const [type, token] = (req.headers.authorization || "").split(" ");
    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "missing_token" });
    }

    try {
      const { payload } = await jwtVerify(token, jwks, {
        issuer: issuer,
        audience: 'http://localhost:3000/billing',
        typ: "at+jwt",
      });

      const scopes = (payload.scope || "").split(" ");
      if (!scopes.includes("billing:read")) {
        return res.status(403).json({ error: "insufficient_scope" });
      }

       res.json({
        api: "billing",
        user: payload.sub,
        client: payload.client_id,
        invoices: [
          { id: "inv-101", amount: 24.99, currency: "USD", status: "paid" },
          { id: "inv-102", amount: 89.0, currency: "USD", status: "due" },
        ],
      });
    } catch (err) {
      res.status(401).json({ error: "invalid_token", detail: err.code });
    }
  });

  return router;
}
