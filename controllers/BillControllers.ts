import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { sendResponse } from "../helpers/response.helpers.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { BillModels } from "../models/BillModels.ts";

export class BillControllers {

    /**
     * Create bill function (post /bills)
     * @param req 
     * @param res 
     */
    static createBill = async(req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserInterfaces = request.user;

            // Récupération de toutes les données du body
            const {id_Stripe, date_payement, montant_ht, montant_ttc, source} = req.body;

            // Instanciation de la facture 
            const bill = new BillModels(<string> user._id, id_Stripe, date_payement, montant_ht, montant_ttc, source);

            // Création de la facture
            await bill.insert();

            const body = {
                error: false, 
                message: "La facture a bien été créé avec succès",
                bill: {
                    user_id: bill.user_id,
                    id_Stripe: bill.id_Stripe,
                    date_payement: bill.date_payement,
                    montant_ht: bill.montant_ht,
                    montant_ttc: bill.montant_ttc,
                    source: bill.source,
                    createdAt: bill.createdAt,
                    updateAt: bill.updateAt,
                }
            }

            // Envoi de la réponse
            sendResponse(res, 201, body);
        } catch (err) {
            // Envoi de la réponse
            sendResponse(res, 400, {message: err})
        }

    }

    /**
     * Get all Bills function (GET /bills)
     * @param req 
     * @param res 
     */
    static getAllBill = async(req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserInterfaces = request.user;

            if(user.role !== 'tuteur') throw new Error("Vos droits d'accès ne permettent pas d'accéder à la ressource")

            //Récupération de toutes les factures de l'utilisateur
            const bills = await BillModels.getAllBill(<string> user._id);

            const body = {
                error: false, 
                bill: bills
            }

            // Envoi de la réponse
            sendResponse(res, 200, body);
        } catch (err) {
            // Création de la réponse d'erreur
            const body = { error: true, message: err.message };
            // Envoi de la réponse
            if (err.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource") sendResponse(res, 403, body);
        }

    }

}