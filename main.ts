import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";;
import * as jwt from './helpers/jwt.helpers.ts';
import { RouteIndex } from "./routes/index.ts";

const port: number = 8001;
const app = opine();

app.use( RouteIndex );

app.listen(port);
// deno run --allow-net --allow-read --unstable main.ts
console.log("app listening on port " + port);