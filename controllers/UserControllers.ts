import { UserModels } from "../models/UserModels.ts";
import { getAuthToken } from "../helpers/jwt.helpers.ts";
import { sendResponse } from "../helpers/response.helpers.ts";
import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";

export class UserControllers {

    /**
     * Login function (POST /login)
     * @param req 
     * @param res 
     */
    static login = async(req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const {email, password} = req.body;

            // Vérification de si toutes les données existe
            if (!email || !password) throw new Error ('Email/password manquants');
            
            // Vérification des informations de l'utilisateur et regarde le nombre de connexion d'affilé
            const user = await UserModels.login(email, password);

            // Génération du token 
            const token = await getAuthToken(user);

            // Création de la réponse
            const body = {
                error: false, 
                message: "L'utilisateur a été authentifié succès",
                user : {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    sexe: user.sexe,
                    role: user.role,
                    dateNaissance: user.dateNaissance,
                    createdAt: user.createdAt,
                    updateAt: user.updateAt,
                    subscription: user.subscription,
                },
                token : token,
            }
            // Envoi de la réponse
            sendResponse(res, 200, body)
        } catch (err) {
            // Création de la réponse d'erreur
            const body = { error: true, message: err.message }
            
            // Envoi de la réponse
            if (err.message === 'Email/password manquants')sendResponse(res, 400, body);
            else if (err.message === 'Email/password incorrect')sendResponse(res, 400, body);
            else sendResponse(res, 429, body);
        }
        
    }

    /**
     * Register function (POST /register)
     * @param req 
     * @param res 
     */
    static register = async(req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const {firstname, lastname, email, password, date_naissance, sexe} = req.body;

            // Vérification de si toutes les données existe
            if (!firstname || !lastname || !email || !password || !date_naissance || !sexe) throw new Error ('Une ou plusieurs données obligatoire sont manquantes');
            
            // Instanciation d'un utilisateur
            const user = new UserModels(firstname, lastname, email, password, sexe, 'tuteur', date_naissance, 0);
            
            // Insertion de l'utilisateur
            await user.insert();

            // Création de la réponse
            const body = {
                error: false, 
                message: "L'utilisateur a bien été créé avec succès",
                user: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    sexe: user.sexe,
                    role: user.role,
                    dateNaissance: user.dateNaissance,
                    createdAt: user.createdAt,
                    updateAt: user.updateAt,
                    subscription: user.subscription,
                }
            }

            // Envoi de la réponse
            sendResponse(res, 200, body)
        } catch (err) {
            // Création de la réponse d'erreur
            const body = { error: true, message: err.message }

            // Envoi de la réponse
            if (err.message === 'Une ou plusieurs données obligatoire sont manquantes')sendResponse(res, 400, body);
            if (err.message === 'Un compte utilisant cette adresse mail est déjà enregistré')sendResponse(res, 409, body);
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