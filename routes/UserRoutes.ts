import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { UserControllers } from "../controllers/UserControllers.ts";
import { authMiddleware } from "../middelwares/AuthMiddlewares.ts";
import { userMiddleware } from "../middelwares/UserMiddelwares.ts";

const route: Application = opine();

route.post('/login', UserControllers.login);
route.post('/register', [userMiddleware], UserControllers.register);
route.post('/subscription', [authMiddleware], UserControllers.subscription);
route.put('/user', [authMiddleware, userMiddleware], UserControllers.editUser);
route.delete('/user/off', [authMiddleware], UserControllers.logout);
route.post('/user/child', [ authMiddleware, userMiddleware], UserControllers.createChild);
route.get('/user/child', [authMiddleware], UserControllers.getAllChild);
route.delete('/user/child', [authMiddleware], UserControllers.deleteChild);
route.put('/user/cart', [authMiddleware], UserControllers.addCart);
route.delete('/user', [authMiddleware], UserControllers.deleteUser);

export { route as UserRouter };