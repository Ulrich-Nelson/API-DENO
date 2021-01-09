import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Application, Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { BillControllers } from "../controllers/BillControllers.ts";


const route: Application = opine();

route.get('/', BillControllers.getAllBill);

export { route as BillRouter }