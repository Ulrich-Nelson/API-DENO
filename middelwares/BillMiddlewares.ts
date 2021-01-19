import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Request, Response, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { sendResponse } from "../helpers/response.helpers.ts";

const middleware: Application = opine();

middleware.use((req: Request, res: Response, next: NextFunction) => {
    try {
        // Vérification de l'existance et du format des données
        const {id_Stripe, date_payement, montant_ht, montant_ttc, source} = req.body;
        if (!id_Stripe && !date_payement && !montant_ht && !montant_ttc && !source) throw new Error('Une ou plusieurs données obligatoire sont manquantes');

        // Si tout se passe bien suite de la requête
        next()
    } catch (err) {
        const body = { error: true, message: err.message }
        if (err.message === 'Une ou plusieurs données obligatoire sont manquantes') sendResponse(res, 400, body);
    }
})

export {middleware as billMiddleware}; 