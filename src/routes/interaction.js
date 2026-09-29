import express from "express";
import { provider } from "../server.js";
import { consentPage, loginPage } from "../views/pages.js";
import { authenticate } from "../service/authenticate.js";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get("/:uid", async (req, res, next) => {
  try {
    debugger;
    const details = await provider.interactionDetails(req, res);
    if (details.prompt.name === "login") {
      res.send(loginPage(details.uid));
    } else {
      res.send(
        consentPage(details.uid, details.params.client_id, details.params.scope)
      );
    }
  } catch (err) {
    next(err);
  }
});

router.post("/:uid/login", async (req, res, next) => {
  try {
    debugger;
    const details = await provider.interactionDetails(req, res);
    const user = authenticate(req.body.username, req.body.password);
    if (!user) {
      return res.send(
        loginPage(
          details.uid,
          "User doenot exits in our database, please enter valid username and password"
        )
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
      }
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

    const grant = new provider.Grant({
      accountId,
      clientId,
    });
    grant.addOIDCScope(details.params.scope);
    const grantId = await grant.save();
    await provider.interactionFinished(
      req,
      res,
      { consent: { grantId } },
      { mergeWithLastSubmission: true }
    );
  } catch (err) {
    next(err);
  }
});

export default router;
