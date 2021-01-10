import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { SongControllers } from "../controllers/SongControllers.ts";


const route: Application = opine();

route.get('/', SongControllers.getAllSongs);
route.get('/:id', SongControllers.getOneSongs);

export { route as SongRouter };