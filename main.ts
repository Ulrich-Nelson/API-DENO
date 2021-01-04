import * as expressive from 'https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts';
import * as jwt from './helpers/jwt.helpers.ts';

const port = 8001;
const app = new expressive.App();

// route with dynamic parameter
app.get("/", async(req: expressive.Request, res: expressive.Response) => {
    
});

(async() => {
    const server = await app.listen(port);
    // deno run server.ts --allow-net --allow-read --unstable --isolatedModules
    console.log("app listening on port " + server.port);
})();