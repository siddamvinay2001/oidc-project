import express from "express";
import { consentPage, loginPage } from "../views/pages.js";
import { authenticate } from "../service/authenticate.js";

export default function createInteractionRoutes(provider) {
  const router = express.Router();
  router.use(express.urlencoded({ extended: true }));

  router.get("/:uid", async (req, res, next) => {
    try {
      const details = await provider.interactionDetails(req, res);
      if (details.prompt.name === "login") {
        res.send(loginPage(details.uid));
      } else {
        res.send(
          consentPage(
            details.uid,
            details.params.client_id,
            details.params.scope,
          ),
        );
      }
    } catch (err) {
      next(err);
    }
  });

  router.post("/:uid/login", async (req, res, next) => {
    try {
      const details = await provider.interactionDetails(req, res);
      const user = authenticate(req.body.username, req.body.password);
      if (!user) {
        return res.send(
          loginPage(
            details.uid,
            "User does not exists in our database, please enter valid username and password",
          ),
        );
      }
      await provider.interactionFinished(
        req,
        res,
        {
          login: {
            accountId: user.id,
          },
        },
        {
          mergeWithLastSubmission: false,
        },
      );
    } catch (err) {
      next(err);
    }
  });

  router.post("/:uid/confirm", async (req, res, next) => {
    try {
      const details = await provider.interactionDetails(req, res);
      const accountId = details.session.accountId;
      const clientId = details.params.client_id;
      const missingOIDCScope = details.prompt.details.missingOIDCScope;
      const missingResourceScopes =
        details.prompt.details.missingResourceScopes;

      let grant;
      if (details.grantId) {
        grant = await provider.Grant.find(details.grantId);
      }
      if (!grant) {
        grant = new provider.Grant({ accountId, clientId });
      }

      if (missingResourceScopes) {
        for (const [resource, scopes] of Object.entries(
          missingResourceScopes,
        )) {
          grant.addResourceScope(resource, scopes.join(" "));
        }
      }
      if (missingOIDCScope) {
        grant.addOIDCScope(missingOIDCScope.join(" "));
      }

      const grantId = await grant.save();

      await provider.interactionFinished(
        req,
        res,
        { consent: { grantId } },
        { mergeWithLastSubmission: true },
      );
    } catch (err) {
      next(err);
    }
  });
  return router;
}
