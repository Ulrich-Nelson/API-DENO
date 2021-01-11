import { RouteIndex } from "./routes/index.ts";
import { opine, json, urlencoded } from "https://deno.land/x/opine@1.0.2/mod.ts";

const port: number = 8001;
const app = opine();

const __dirname = new URL('.', import.meta.url).pathname;

app.use(json());
app.use(urlencoded());

app.get('/', (req, res)=> {
    res.sendFile( __dirname.substring(1) + 'public/index.html');
});

app.use( RouteIndex );

app.get('*', (req, res)=> {
    res.sendFile(__dirname.substring(1) + 'public/error.html');
});

app.listen(port);
// deno run --allow-net --allow-read --unstable main.ts
console.log("app running at: http://localhost:" + port);