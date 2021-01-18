import * as expressive from 'https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts';
import { Application, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { opine } from "https://deno.land/x/opine@1.0.2/src/opine.ts";
import { getJwtPayload } from "../helpers/jwt.helpers.ts";



// Fichier pour vérifier si l'utilisateur utilise bien un token ou non
const middleware: Application = opine();

//récupération du header
const extractBearerToken = (headerValue: string) => {
    if (typeof headerValue !== 'string') {
        return false
    }
    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

//Vos droits d'accès ne permettent pas d'accéder à la ressource
// middleware.use((req: Request, _res: Response, next: NextFunction) => {
//     try {
//     //Récupération du token
//     const token = req.headers && extractBearerToken(req.headers)
//     //Présence d'un token
//     if (!token) throw new Error("Vos droits d'accès ne permettent pas d'accéder à la ressource");
//     getJwtPayload(token)
//     next()
//     } catch (err) {
//     }
// })


export {middleware as authMiddleware};