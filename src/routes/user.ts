import express, { Request, Response, Router } from 'express'
import { send } from 'process';
import UserCtlr from '../controllers/userController'
import { User } from '../interface/interface';
 
const router = Router();

//get user information
router.get('/:id', async (res:any, req:any) => {
    const request:Request = req.req;
    const response:Response = res.res;
    const result = await UserCtlr.GetUserByUid(request.params.id);
    response.send(result);
})

router.patch('/:id', async (res:any, req:any) => {
    const request:Request = req.req;
    const response:Response = res.res;
    const result = await UserCtlr.UpdateUserByUid(request.params.id, req.body);
    response.send(result);
})

//get user information
router.get('/', async (res:any, req:any) => {
    const request:Request = req.req;
    const response:Response = res.res;
    const result = await UserCtlr.GetUsers();
    response.send(result);
})

module.exports = (app:any) => app.use('/users', router);