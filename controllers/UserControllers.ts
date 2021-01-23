import { UserModels } from "../models/UserModels.ts";
import { sendResponse } from "../helpers/response.helpers.ts";
import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { sendMail } from "../helpers/email.helpers.ts";

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
            const token = await UserModels.generateAuthToken(user);

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
            const body = { error: true, message: err.message };
            
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
            
            // Instanciation d'un utilisateur
            const user = new UserModels(firstname, lastname, email, password, sexe, 'tuteur', date_naissance, 0);
            
            // Insertion de l'utilisateur
            await user.insert();

            // Envoi du mail à l'utilisateur
            await sendMail(user.email);

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
            sendResponse(res, 200, body);
        } catch (err) {
            // Création de la réponse d'erreur
            const body = { error: true, message: err.message };
            // Envoi de la réponse
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
        try {
            //Récupération de toutes les données du body
            const {firstname, lastname, date_naissance, sexe} = req.body;

            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans la requête
            const request: any = req;
            const user: UserInterfaces = request.user;

            // Modifier les valeurs les propriétés de l'utilisateur courant
            if (firstname) user.firstname = firstname;
            if (lastname) user.lastname = lastname;
            if (date_naissance) user.dateNaissance = date_naissance;
            if (sexe) user.sexe = sexe;

            //Mettre à jour ses différentes valeurs
            await UserModels.update(user);

            // Création de la réponse
            const body = {
                error: false, 
                message: "Vos données ont été mises à jour",
            }
            // Envoi de la réponse
            sendResponse(res, 200, body)
        } catch (err) {
            const body = { error: true, message: err.message }
            if (err.message === 'Une ou plusieurs données obligatoire sont manquantes')sendResponse(res, 409, body);
        }
    }

    /**
     * Logout user function (DELETE /user/off)
     * @param req 
     * @param res 
     */
    static logout = async(req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserInterfaces = request.user;


            // Suppression du token et mise à jour du token
            user.token = '';
            user.refreshToken = '';
            await UserModels.update(user);

            const body = {
                error: false, 
                message: "L'utilisateur a été déconnecté avec succès",
            }
            // Envoi de la réponse
            sendResponse(res, 200, body);
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Get all child function (GET /user/child)
     * @param req 
     * @param res 
     */
    static getAllChild = async(req: Request, res: Response) => {
        try {

            //Récupération de l'utilisateur courant
            const request: any = req;
            const parent: UserInterfaces = request.user;
            if(parent.role !== 'tuteur')throw new Error ('Vos droits d\'accès ne permettent pas d\'accéder à la ressource');
            
            //récupérer tous les  enfants du parent associé
           const allchild = await UserModels.getAllchild(parent)

           // Création de la réponse
           const body = {
            error: false, 
            users: allchild }

            // Envoi de la réponse
           sendResponse(res, 200, body);
        } catch (err) {
            const body = { error: true, message: err.message }
            if (err.message === 'Vos droits d\'accès ne permettent pas d\'accéder à la ressource')sendResponse(res, 403, body);
        }

    }

    /**
     * Create child function (POST /user/child)
     * @param req 
     * @param res 
     */
    static createChild = async(req: Request, res: Response) => {
        try {

            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const parent: UserInterfaces = request.user;
            if(parent.role !== 'tuteur')throw new Error ('Vos droits d\'accès ne permettent pas d\'accéder à la ressource');
            // Récupération de toutes les données du body
            const {firstname, lastname, email, password, date_naissance, sexe} = req.body;

            // Vérification de si toutes les données existe
            if (!firstname || !lastname || !email || !password || !date_naissance || !sexe) throw new Error ('Une ou plusieurs données obligatoire sont manquantes');
            
            // Instanciation d'un utilisateur (enfant)
            const user = new UserModels(firstname, lastname, email, password, sexe, 'enfant', date_naissance, 0, <string> parent._id);

            // Insertion de l'utilisateur
            await user.insert();

            // Envoi du mail à l'utilisateur
            await sendMail(user.email);

            // Création de la réponse
            const body = {
                error: false, 
                message: "Votre enfant a bien été créé avec succès",
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
            if (err.message === "Vous avez dépassé le cota de trois enfants")sendResponse(res, 409, body);
            if (err.message === 'Un compte utilisant cette adresse mail est déjà enregistré')sendResponse(res, 409, body);
            if (err.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource")sendResponse(res, 403, body);
        }

    }

    /**
     * Delete child function (DELETE /user/child)
     * @param req 
     * @param res 
     */
    static deleteChild = async(req: Request, res: Response) => {

        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserInterfaces = request.user;
            if(user.role !== 'tuteur')throw new Error ('Vos droits d\'accès ne permettent pas d\'accéder à la ressource');

            // Récupération de l'indentifiant de l'enfant depuis le body
            const {id_child} = req.body;

            // vérifier la taille de l'identifiant
            if(id_child.length !== 24 ) throw new Error ("Vous ne pouvez pas supprimer cet enfant");
            
            //si la taille est conforme, vérifier que l'utilisateur existe en BD
            const isValidId = await UserModels.getOneUser(id_child)
            
            //retourner un message d'erreur si aucun utilisateur existe
            if(!isValidId)throw new Error ("Vous ne pouvez pas supprimer cet enfant");

            // Supprimer l'enfant à partir de son identifiant
            await UserModels.delete(id_child)  
             
            // Création de la réponse
            const body = {
                error: false, 
                message: "L'utilisateur a été supprimée avec succès",
            }

            // Envoi de la réponse
            sendResponse(res, 200, body)
            
        } catch (err) {
            // Création de la réponse d'erreur
            const body = { error: true, message: err.message }
            if (err.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource")sendResponse(res, 403, body);
            else if (err.message === "Vous ne pouvez pas supprimer cet enfant")sendResponse(res, 403, body);

        }
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