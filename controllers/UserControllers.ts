import { sendResponse } from "../helpers/response.helpers.ts";
import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import EmailException from "../exceptions/EmailExceptions.ts";
import { UserModels } from "../models/UserModels.ts";

export class UserControllers {

    /**
     * Login function (POST /login)
     * @param req 
     * @param res 
     */
    static login = async(req: Request, res: Response) => {

    }

    /**
     * Register function (POST /register)
     * @param req 
     * @param res 
     */
    static register = async(req: Request, res: Response) => {
        try {
            const {firstname, lastname, email, password, date_naissance, sexe} = req.body;
            // Vérification de si toutes les données existe
            if (!firstname || !lastname || !email || !password || !date_naissance || !sexe) throw new Error ('Une ou plusieurs données obligatoire sont manquantes');
            const user = new UserModels(firstname, lastname, email, password, sexe, 'tuteur', date_naissance, 0);
            await user.insert();
            console.log(user);
            const body = {
                error: false, 
                message: "L'utilisateur a bien été créé avec succès",
                user: {}
            }
            sendResponse(res, 200, body)
        } catch (err) {
            console.log(err.message);
            const body = { error: true, message: err.message }
            if (err.message === 'Une ou plusieurs données obligatoire sont manquantes')sendResponse(res, 400, body);
            if (err.message === 'Un compte utilisant cette adresse mail est déjà enregistré')sendResponse(res, 409, body);
            if (err.message === 'Email/password incorrect')sendResponse(res, 400, body);
        }
    }

    /**
     * Subscription function (POST /subscription)
     * @param req 
     * @param res 
     */
    static subscription = async(req: Request, res: Response) => {

    }

    /**
     * Edit user function (PUT /user)
     * @param req 
     * @param res 
     */
    static editUser = async(req: Request, res: Response) => {

    }

    /**
     * Logout user function (DELETE /user/off)
     * @param req 
     * @param res 
     */
    static logout = async(req: Request, res: Response) => {

    }

    /**
     * Get all child function (GET /user/child)
     * @param req 
     * @param res 
     */
    static getAllChild = async(req: Request, res: Response) => {

    }

    /**
     * Create child function (POST /user/child)
     * @param req 
     * @param res 
     */
    static createChild = async(req: Request, res: Response) => {

    }

    /**
     * Delete child function (DELETE /user/child)
     * @param req 
     * @param res 
     */
    static deleteChild = async(req: Request, res: Response) => {

    }

    /**
     * Delete user function (DELETE /user)
     * @param req 
     * @param res 
     */
    static deleteUser = async(req: Request, res: Response) => {

    }

    /**
     * Add cart to user function (PUT /user/cart)
     * @param req 
     * @param res 
     */
    static addCart = async(req: Request, res: Response) => {

    }

    
}