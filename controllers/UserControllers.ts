import { UserModels } from "../models/UserModels.ts";
import { sendResponse } from "../helpers/response.helpers.ts";
import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { sendMail } from "../helpers/email.helpers.ts";
import CardException from "../exceptions/CardException.ts";
import { addCardStripe, addCustomerStripe, paymentStripe, updateCustomerCardStripe } from "../helpers/stripe.helpers.ts";
import { BillModels } from "../models/BillModels.ts";

import { config } from '../config/config.ts';

const {
    STRIPE_PRICE_KEY,
} = config;

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
            const user = new UserModels(firstname, lastname, email, password, sexe, 'Tuteur', date_naissance, 0);
            
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
            sendResponse(res, 201, body);
        } catch (err) {
            // Création de la réponse d'erreur
            const body = { error: true, message: err.message };
            // Envoi de la réponse
            if (err.message === 'Un compte utilisant cette adresse mail est déjà enregistré')sendResponse(res, 409, body);
        }
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
            if (err.message === 'Une ou plusieurs données obligatoire sont manquantes')sendResponse(res, 400, body);
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
            if(parent.role !== 'Tuteur')throw new Error ('Vos droits d\'accès ne permettent pas d\'accéder à la ressource');
            
            //récupérer tous les  enfants du parent associé
            const allchild = await UserModels.getAllchild(parent)

           // Création de la réponse
            const body = {
                error: false, 
                users: allchild 
            }

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
            if(parent.role !== 'Tuteur')throw new Error ('Vos droits d\'accès ne permettent pas d\'accéder à la ressource');
            // Récupération de toutes les données du body
            const {firstname, lastname, email, password, date_naissance, sexe} = req.body;

            // Vérification de si toutes les données existe
            if (!firstname || !lastname || !email || !password || !date_naissance || !sexe) throw new Error ('Une ou plusieurs données obligatoire sont manquantes');
            
            // Instanciation d'un utilisateur (enfant)
            const user = new UserModels(firstname, lastname, email, password, sexe, 'Enfant', date_naissance, 0, <string> parent._id);

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
            sendResponse(res, 201, body)
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
            if(user.role !== 'Tuteur')throw new Error ('Vos droits d\'accès ne permettent pas d\'accéder à la ressource');

            // Récupération de l'indentifiant de l'enfant depuis le body
            const {id_child} = req.body;

            // vérifier la taille de l'identifiant
            if(id_child.length !== 24 ) throw new Error ("Vous ne pouvez pas supprimer cet enfant");
            
            //si la taille est conforme, vérifier que l'utilisateur existe en BD
            const child = await UserModels.getOneUser(id_child)
            
            //retourner un message d'erreur si aucun utilisateur existe
            if(!child)throw new Error ("Vous ne pouvez pas supprimer cet enfant");
            
            // vérifier que l'id_parent est identique à au tuteur qui fait la requête
            const isMatch = (child.id_parent?.toString() !== user._id?.toString())
            if(isMatch) throw new Error ("Vous ne pouvez pas supprimer cet enfant");

            // Supprimer l'enfant à partir de son identifiant            
            await UserModels.delete(child);
            
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
            if (err.message === "Vous ne pouvez pas supprimer cet enfant")sendResponse(res, 403, body);
        }
    }

    /**
     * Delete user function (DELETE /user)
     * @param req 
     * @param res 
     */
    static deleteUser = async(req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserInterfaces = request.user;
            if(user.role !== 'Tuteur')throw new Error (`Votre token n'est pas correct`);

            // désactiver(supprimer) le compte de l'utilisateur
            user.isActive = false;
            user.token = '';
            user.refreshToken = '';
            await UserModels.update(user);

            // désactiver(supprimer) le compte des enfants
            await UserModels.updateAllChild(user)

            // Envoi de la réponse
            const body = {
                error: false, 
                message: "Votre compte et le compte de vos enfants ont été supprimés avec succès",
            }

            // Envoi de la réponse
            sendResponse(res, 200, body);

        } catch (err) {
            const body = { error: true, message: err.message }
            if (err.message === `Votre token n'est pas correct`)sendResponse(res, 401, body);
        }
    }

    /**
     * Add cart to user function (PUT /user/cart)
     * @param req 
     * @param res 
     */
    static addCart = async(req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserInterfaces = request.user;
            if(user.role !== 'Tuteur')throw new Error (`Vos droits d'accès ne permettent pas d'accéder à la ressource`);

            // Vérification de l'existance des données et de leurs formats
            const {cartNumber, month, year} = req.body;

            if (!cartNumber || !month || !year || !req.body.default === undefined) throw new Error ('Une ou plusieurs données obligatoire sont manquantes');

            if (!CardException.checkCardNumber(cartNumber)) throw new Error ('Une ou plusieurs données sont erronées');
            if (!CardException.checkCardYear(year)) throw new Error ('Une ou plusieurs données sont erronées');
            if (!CardException.checkCardMonth(month)) throw new Error ('Une ou plusieurs données sont erronées');
            if (!CardException.checkDefault(req.body.default)) throw new Error ('Une ou plusieurs données sont erronées');

            // Vérification de la validité de la carte
            addCardStripe(cartNumber, month, year).then(
                () => {
                    try {
                        // Vérification de si la carte existe déjà
                        const filterCard = user.card.filter((card) => card.cartNumber === cartNumber)
    
                        if (filterCard.length === 0) user.card.push({id: user.card.length + 1, cartNumber: cartNumber, month: month, year: year});
                        else throw new Error('La carte existe déjà');
    
                        // Update de la carte dans la base de donnée
                        UserModels.update(user);
                        
                        // Envoi de la réponse
                        const body = {
                            error: false, 
                            message: "Vos données ont été mises à jour",
                        }
    
                        // Envoi de la réponse
                        sendResponse(res, 200, body);
                    } catch (err) {
                        const body = { error: true, message: err.message }
                        if (err.message === 'La carte existe déjà')sendResponse(res, 409, body);
                    }
                },
                () => {
                    try {
                        throw new Error('Informations bancaire incorrectes')
                    } catch (err) {
                        const body = { error: true, message: err.message }
                        if (err.message === 'Informations bancaire incorrectes')sendResponse(res, 402, body);
                    }
                }
            );

        } catch (err) {
            const body = { error: true, message: err.message }
            if (err.message === 'Une ou plusieurs données obligatoire sont manquantes')sendResponse(res, 400, body);
            if (err.message === 'Une ou plusieurs données sont erronées')sendResponse(res, 409, body);
            if (err.message === `Vos droits d'accès ne permettent pas d'accéder à la ressource`)sendResponse(res, 403, body);
        }
    }   

    /**
     * Subscription function (POST /subscription)
     * @param req 
     * @param res 
     */
    static subscription = async(req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserInterfaces = request.user;
            if(user.role !== 'Tuteur')throw new Error (`Vos droits d'accès ne permettent pas d'accéder à la ressource`);

            // Vérification de l'existance des données 
            const {id, cvc} = req.body;
            if (!id === undefined || !cvc) throw new Error ('Une ou plusieurs données obligatoire sont manquantes');

            // Check de la validité du cvc
            if (!CardException.checkCVC(parseInt(cvc))) throw new Error ('Une ou plusieurs données sont erronées');

            // Vérification de si l'utilisateur à bien la carte
            if (user.card.length === 0) throw new Error('Veuillez compléter votre profil avec une carte de crédit');
            const card = user.card.filter((card) => card.id === parseInt(id))[0];
            if (!card) throw new Error('Veuillez compléter votre profil avec une carte de crédit');

             // Création de la carte pour le payement
            addCardStripe(parseInt(card.cartNumber), parseInt(card.month), parseInt(card.year)).then(
                (data) => {
                    const stripeCard = data.data;
                    // Création d'un utilisateur stripe
                    addCustomerStripe(user.email, user.firstname + ' ' + user.lastname).then(
                        (data) => {
                            const stripeCustomer = data.data;
                            // Ajout de la carte au customer
                            updateCustomerCardStripe(stripeCustomer.id, stripeCard.id).then(
                                async () => {
                                    // Payement de l'objet différent en fonction de si premier abonnement ou non
                                    const alreadySubscribe = (await BillModels.getAllBill(<string>user._id)).length !== 0;

                                    if (alreadySubscribe) {
                                        paymentStripe(stripeCustomer.id, STRIPE_PRICE_KEY).then(
                                            async (data) => {
                                                await UserModels.updateSubscription(user, 1);
                                                const facture = new BillModels(<string>user._id, data?.data.id , new Date(), 4.50, 4.99, 'Stripe');
                                                await facture.insert();
                                                sendResponse(res, 200, {error: true, message: `Votre abonnement a bien été mise à jour`});
                                            },
                                            () => sendResponse(res, 402, {error: true, message: `Echec du payement de l'offre`}),
                                        );
                                    } else {
                                        await UserModels.updateSubscription(user, 1);
                                        setTimeout(() => {
                                            paymentStripe(stripeCustomer.id, STRIPE_PRICE_KEY).then(
                                                async (data) => {
                                                    await UserModels.updateSubscription(user, 1);
                                                    await sendMail(user.email);
                                                    const facture = new BillModels(<string>user._id, data?.data.id , new Date(), 4.50, 4.99, 'Stripe');
                                                    await facture.insert();  
                                                },
                                                async () => await UserModels.updateSubscription(user, 0),
                                            );
                                        },  60000 * 5);
                                        sendResponse(res, 200, {error: true, message: `Votre période d'essai viens d'être activé - 5min`});
                                    }
                                },
                                () => sendResponse(res, 402, {error: true, message: `Echec du payement de l'offre`}),
                            )
                        },
                        () => sendResponse(res, 402, {error: true, message: `Echec du payement de l'offre`}),
                    );
                },
                () => sendResponse(res, 402, {error: true, message: `Echec du payement de l'offre`}),
            );
        } catch (err) {
            const body = { error: true, message: err.message }
            if (err.message === 'Une ou plusieurs données obligatoire sont manquantes')sendResponse(res, 400, body);
            if (err.message === 'Une ou plusieurs données sont erronées')sendResponse(res, 409, body);
            if (err.message === `Vos droits d'accès ne permettent pas d'accéder à la ressource`)sendResponse(res, 403, body);
            if (err.message === 'Veuillez compléter votre profil avec une carte de crédit')sendResponse(res, 403, body);
        }
    }

}