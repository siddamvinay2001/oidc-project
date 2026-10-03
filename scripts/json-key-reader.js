import crypto from "crypto";
import fs from "fs";

const jwk = crypto
  .createPrivateKey(fs.readFileSync("keys/private.pem"))
  .export({ format: "jwk" });
Object.assign(jwk, { kid: "key-1", alg: "RS256", use: "sig" });
fs.writeFileSync("keys/jwks.json", JSON.stringify({ keys: [jwk] }, null, 2));
