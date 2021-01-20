import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { sendResponse } from "../helpers/response.helpers.ts";
import { play } from "https://deno.land/x/audio@0.1.0/mod.ts";

export class SongControllers {

    /**
     * Get a Song function (GET /songs/:id)
     * @param req 
     * @param res 
     */
    static createOneSong = async(req: Request, res: Response) => {

    }

    /**
     * Get all Songs function (GET /songs)
     * @param req 
     * @param res 
     */
    static getAllSongs = async(req: Request, res: Response) => {

    }

    /**
     * Get a Song function (GET /songs/:id)
     * @param req 
     * @param res 
     */
    static getOneSong = async(req: Request, res: Response) => {
        try {
            const filename = 'C:/Users/seb_l/Desktop/Application web/API-DENO/public/assets/mp3/file.mp3';
            // const stat = Deno.statSync(filePath);
            // const total = stat.size;

            // console.log(req.headers.get('range'));

            // new ReadableStream(filePath).pipeTo(res)

            // const file = await Deno.open(filename);
            // const bufReader = new BufReader(file);
            // file.close();

            play(filename);

            sendResponse(res, 200, {error: false, song: {}})
        } catch (err) {
            console.log(err);
        }

    }

}