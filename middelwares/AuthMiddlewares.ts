import * as expressive from 'https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts';
import { Application, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { opine } from "https://deno.land/x/opine@1.0.2/src/opine.ts";
import { sendResponse } from '../helpers/response.helpers.ts';



// Fichier pour vérifier si l'utilisateur utilise bien un token ou non
const middleware: Application = opine();

//récupération du header
const extractBearerToken = (headerValue: any) => {
    if (typeof headerValue !== 'string') {
        return false
    }
    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}


middleware.use((req: Request) => {
    try {
    // Récupération du token
    const token = req.headers && extractBearerToken(req.headers)
    // Présence d'un token
    if (!token) throw new Error('Une ou plusieurs données sont erronées');
    
    } catch (err) {
    }
})


export {middleware as authMiddleware};