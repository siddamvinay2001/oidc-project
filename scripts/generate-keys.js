import crypto from "crypto";
import fs from "fs";

const FILE = "keys/jwks.json";

let keys = [];
if (fs.existsSync(FILE)) {
  keys = JSON.parse(fs.readFileSync(FILE, "utf8")).keys;
}

const { privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const jwk = privateKey.export({ format: "jwk" });
jwk.kid = "key-" + (keys.length + 1);
jwk.alg = "RS256";
jwk.use = "sig";

keys.unshift(jwk);

fs.mkdirSync("keys", { recursive: true });
fs.writeFileSync("keys/jwks.json", JSON.stringify({ keys }, null, 2));
