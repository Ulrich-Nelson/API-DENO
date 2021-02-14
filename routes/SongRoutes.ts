import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { SongControllers } from "../controllers/SongControllers.ts";
import { authMiddleware } from "../middelwares/AuthMiddlewares.ts";


const route: Application = opine();

route.post('/', [authMiddleware], SongControllers.createOneSong);
route.get('/', [authMiddleware], SongControllers.getAllSongs);
route.get('/play/:fileName', [authMiddleware], SongControllers.playSong);
route.get('/:id', [authMiddleware], SongControllers.getOneSong);

export { route as SongRouter };