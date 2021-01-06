import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Application } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { UserControllers } from "../controllers/UserControllers.ts";


const route: Application = opine();

route.get('/', UserControllers.get)

export { route as UserRouter }