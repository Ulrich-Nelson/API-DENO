import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Request, Response, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { getJwtPayload } from "../helpers/jwt.helpers.ts";
import { sendResponse } from "../helpers/response.helpers.ts";
import { UserModels } from "../models/UserModels.ts";
import { jwtPayload } from "../types/jwtTypes.ts";

const middleware: Application = opine();

middleware.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Récupération du token
        const token = req.headers.get('authorization')?.replace('Bearer ', '');

        // Récupération du payload si le token existe
        const payload: jwtPayload = (token) ? await getJwtPayload(token) : null;
        if (!payload) throw new Error("Votre token n'est pas correct");

        // Récupération de l'utilisateur pour le mettre dans le req et y avoir dans les routes après
        const user = await UserModels.getOneUser(payload.id, token);
        if (!user) throw new Error("Votre token n'est pas correct");
        Object.assign(req, {user: user});

        // Si tout se passe bien suite de la requête
        next();
    } catch (err) {
        const body = { error: true, message: err.message };
        if (err.message === "Votre token n'est pas correct") sendResponse(res, 401, body);
    }
})

export {middleware as authMiddleware}; 

