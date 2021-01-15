import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { BillControllers } from "../controllers/BillControllers.ts";


const route: Application = opine();

route.get('/', BillControllers.getAllBill);

export { route as BillRouter }