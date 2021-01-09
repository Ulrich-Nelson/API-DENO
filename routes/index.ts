import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { BillRouter } from './BillRoutes.ts';
import { SongRouter } from "./SongRoutes.ts";
import { UserRouter } from "./UserRoutes.ts";


const route = opine();

route.use('/', UserRouter);
route.use('/songs', SongRouter);
route.use('/bills', BillRouter);

export { route as RouteIndex };