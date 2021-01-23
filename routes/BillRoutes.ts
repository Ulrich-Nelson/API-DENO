import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { BillControllers } from "../controllers/BillControllers.ts";
import { authMiddleware } from "../middelwares/AuthMiddlewares.ts";
import { billMiddleware } from "../middelwares/BillMiddlewares.ts";


const route: Application = opine();

route.post('/', authMiddleware, billMiddleware, BillControllers.createBill);
route.get('/', authMiddleware, BillControllers.getAllBill);

export { route as BillRouter }