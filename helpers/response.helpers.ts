import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";

/**
 * Fontion d'envoi de réponse préfaite
 * @param res 
 * @param code 
 * @param body 
 */
const sendResponse = (res: Response, code: number, body: Object) => {
    res.setStatus(code).send(body);
}

export { sendResponse }