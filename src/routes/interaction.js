import express from 'express';
import { provider } from '../server.js';
import { consentPage, loginPage } from '../views/pages.js';
import { authenticate } from '../service/authenticate.js';

const router = express.Router();
router.use(express.urlencoded({extended: true}))

router.get('/:uid', async(req,res,next)=>{
    try{
        const details = await provider.interactionDetails(req,res);
        if(details.prompt.name === 'login'){
            res.send(loginPage(details.uid))
        }else{
            res.send(consentPage(details.uid, details.params.client_id, details.params.scope))
        }
    }catch(err){
        next(err)
    }
})

router.post('/:uid/login', async(req,res,next)=>{
    try{
        const details = await provider.interactionDetails(req,res);
        const accountId = authenticate(req.body.username, req.body.password);
    }catch(err){
        next(err);
    }
})

export default router;