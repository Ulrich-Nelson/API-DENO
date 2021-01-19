import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { UserControllers } from "../controllers/UserControllers.ts";
import { authMiddleware } from "../middelwares/AuthMiddlewares.ts";
import { userMiddleware } from "../middelwares/UserMiddelwares.ts";

const route: Application = opine();

route.post('/login', UserControllers.login);
route.post('/register', userMiddleware, UserControllers.register);
route.post('/subscription', UserControllers.subscription);
route.put('/user', UserControllers.editUser);
route.delete('/user/off', authMiddleware, UserControllers.logout);
route.post('/user/child', [ userMiddleware, authMiddleware], UserControllers.createChild);
route.get('/user/child', UserControllers.getAllChild);
route.delete('/user/child', UserControllers.deleteChild);
route.put('/user/cart', UserControllers.addCart);
route.delete('/user', UserControllers.deleteUser);

export { route as UserRouter };