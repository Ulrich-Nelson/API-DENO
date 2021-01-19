// Fichier pour vérifier les infos de l'utilisateur
import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Request, Response, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import DateException from "../exceptions/DateExceptions.ts";
import EmailException from "../exceptions/EmailExceptions.ts";
import PasswordException from "../exceptions/PasswordExceptions.ts";
import { sendResponse } from "../helpers/response.helpers.ts";

const middleware: Application = opine();

//middelware pour la vérification des données postées
middleware.use((req: Request, res: Response, next: NextFunction) => {
    try {

        // Vérification de l'existance et du format des données
        const {email, password, date_naissance, sexe} = req.body;
        if (!email && !EmailException.checkEmail(email)) throw new EmailException('Une ou plusieurs données sont erronées');
        if (!password && !PasswordException.isValidPassword(password)) throw new PasswordException('Une ou plusieurs données sont erronées');
        if (!date_naissance && !DateException.checkDate(date_naissance)) throw new DateException('Une ou plusieurs données sont erronées');
        if (!sexe && sexe !== 'Homme' && sexe !== 'Femme') throw new Error('Une ou plusieurs données sont erronées');

        // Si tout se passe bien suite de la requête
        next()
    } catch (err) {
        const body = { error: true, message: err.message }
        if (err.message === 'Une ou plusieurs données sont erronées') sendResponse(res, 409, body);
    }
})


export {middleware as userMiddleware}; 