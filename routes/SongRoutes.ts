import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Application } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { SongControllers } from "../controllers/SongControllers.ts";


const route: Application = opine();

route.get('/', SongControllers.get)

export { route as SongRouter }