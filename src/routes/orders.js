import express from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

export default function ordersRoutes(issuer) {
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
        audience: issuer + "/orders",
        typ: "at+jwt",
      });

      const scopes = (payload.scope || "").split(" ");
      if (!scopes.includes("orders:read")) {
        return res.status(403).json({ error: "insufficient_scope" });
      }

      res.json({
        user: payload.sub,
        client: payload.client_id,
        orders: [
          { id: "ord-1", item: "Coffee beans", qty: 2 },
          { id: "ord-2", item: "Grinder", qty: 1 },
        ],
      });
    } catch (err) {
      res.status(401).json({ error: "invalid_token", detail: err.code });
    }
  });

  return router;
}
