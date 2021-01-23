import { db } from "../db/db.ts";
import { comparePass, hash } from "../helpers/password.helpers.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { userRoleType, sexeType, subscriptionType, allChildType } from "../types/userTypes.ts";
import { Bson } from "https://deno.land/x/mongo@v0.21.2/mod.ts";
import { getAuthToken } from "../helpers/jwt.helpers.ts";




export class UserModels implements UserInterfaces {
    
    private userdb: any;
    private static userdb = db.collection < UserInterfaces > ("users");
    
    _id: string | null | { $oid: string; } | undefined;
    id_parent: string | { $oid: string; } | undefined;
    firstname: string;
    lastname: string;
    email: string;
    password:string;
    sexe: sexeType;
    role: userRoleType;
    dateNaissance: Date;
    subscription: subscriptionType;

    createdAt: Date;
    updateAt: Date;

    attempt: number;
    lastLogin: Date;

    token: string;
    refreshToken: string;

    constructor(firstname: string, lastname: string, email: string, password: string, sexe: sexeType, role: userRoleType, dateNaissance: Date, subscription: subscriptionType, id_parent?: { $oid: string } |string,
        createdAt: Date = new Date(), updateAt: Date = new Date(), lastLogin: Date = new Date(), attempt: number = 0, token = '', refreshToken = '' ) {
        this.userdb = db.collection < UserInterfaces > ("users");
        this.firstname = firstname;
        this.lastname =  lastname;
        this.email = email;
        this.password = password;
        this.sexe = sexe;
        
        this.role = role;
        this.dateNaissance = new Date (dateNaissance);
        this.subscription = subscription;
        this.createdAt = createdAt; 
        this.updateAt = updateAt;
        this.lastLogin = lastLogin;
        this.attempt = attempt;
        this.token = token;
        this.refreshToken = refreshToken;
        if(this.role === 'enfant') this.id_parent = id_parent
    }

    get id(): null | string | {$oid: string} | undefined {
        return (this._id === null) ? null : this._id;
    }

    /**
     * Insertion d'un utilisateur en base de données
     */
    async insert(): Promise < void > {
        const alreadyExist = await this.userdb.findOne({email: this.email});
        if (alreadyExist) throw new Error('Un compte utilisant cette adresse mail est déjà enregistré');
        this.password = await hash(this.password);
        const toInsert = {
            firstname : this.firstname,
            lastname : this.lastname,
            email : this.email,
            password : this.password,
            sexe : this.sexe,
            role : this.role,
            dateNaissance : this.dateNaissance,
            subscription : this.subscription,
            createdAt: this.createdAt,
            updateAt: this.updateAt,
            lastLogin : new Date(),
            attempt : 0,
            token: this.token,
            refreshToken: this.refreshToken,
        }
        if(this.id_parent) {
            const nbChild  = await this.userdb.count({id_parent: this.id_parent});
            if(nbChild === 3) throw new Error("Vous avez dépassé le cota de trois enfants");
            Object.assign(toInsert, { id_parent: this.id_parent });
        }
        this._id =  this.userdb.insertOne(toInsert);
    };



    /**
     * Modification d'un utilisateur
     * @param user UserInterface
     */
    static async update(user: UserInterfaces): Promise <void> {
        try {
            await this.userdb.updateOne({_id: user._id}, user);
        } catch (err) {
            console.log(err);
        }
    }


     /**
     * suppression d'un enfant appartement à un parent
     * @param user childInterface
     */
    static async delete(user: allChildType): Promise <void> {
        try {
            await this.userdb.deleteOne({_id: user._id });
        } catch (err) {
            console.log(err);
        }
    }


    /**
     * récupération de tous les enfants d'un parent
     * @param user UserInterface
     */
    static async getAllchild(user: UserInterfaces): Promise <allChildType[] | void>{
        try {

            const allChild = await this.userdb.find({id_parent: user._id}, {}).toArray()
            
           //enlever les données non désirables
            allChild.map((target: allChildType) =>{
                Object.assign(target, {_id: target._id});
                delete target._id 
                delete target.id_parent
                delete target.email
                delete target.password
                delete target.refreshToken
                delete target.token
                delete target.lastLogin
                delete target.attempt
            })
        
        // retourner les données si elles existent
        if (allChild) return allChild;
        else return [];

        } catch (err) {
            console.log(err)
        }
    }


    /**
     * Génération du token et modification en base de donnée
     * @param user UserInterface
     */
    static async generateAuthToken(user: UserInterfaces): Promise <string | void> {
        try {
            // Génération du token
            user.token = await getAuthToken(user);
    
            // Mise à jour du token de l'utilisateur dans la db
            await this.userdb.updateOne({_id: user._id}, user);
    
            // On retourne le token
            return user.token;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Recherche un utilisateur en base de donné, et regarde si les credentials sont bon
     * Vérifie également le nombre de connexion d'affilé
     * @param email Email
     * @param password Mot de passe
     */
    static async login(email: string, password:string): Promise <UserInterfaces> {
        const user: UserInterfaces | undefined = await this.userdb.findOne({email: email});

        // Si aucun utilisateur n'a cet email
        if (!user) throw new Error('Email/password incorrect');

        // Si l'utilisateur à respecter les deux minutes d'attente on remet sont nombres d'essai à 0
        if(user.attempt >= 5  && ((new Date().getTime() - user.lastLogin.getTime()) / 1000 / 60) >= 2) {
            user.lastLogin = new Date();
            user.attempt = 0;
            await this.userdb.updateOne({_id: user._id}, user);
        }

        // On vérifie le nombre de connnexion et le temps depuis la dernière connexion
        if(user.attempt >= 5  && ((new Date().getTime() - user.lastLogin.getTime()) / 1000 / 60) <= 2)
            throw new Error("Trop de tentative sur l'email "+ user.email +" (5 max) - Veuillez patienter (2min)");
        

        // On compare le mot de passe pour savoir si il peut se connecter ou non, et si non on ajoute un essai de connexion
        const comparePassword = await comparePass(password, user.password);
        if (!comparePassword) {
            user.lastLogin = new Date();
            user.attempt += 1;
            await this.userdb.updateOne({_id: user._id}, user);
            throw new Error('Email/password incorrect');
        }

        // Si tout c'est bien passé dans la connexion, on remet les essais à 0
        user.lastLogin = new Date();
        user.attempt = 0;
        await this.userdb.updateOne({_id: user._id}, user);

        return (user);
    }

    
    
    /**
     * Récupération d'un utilisateur par son id et optionnelement son token pour s'assurer que c'est un user connecté.
     * @param id MongoDB ID
     * @param token JWT token
     */
    static async getOneUser(id: string, token?: string): Promise <UserInterfaces | null> {

        // Récupération de l'utilisateur en fonction des constante de la fonction
        const user = (token) ? await this.userdb.findOne({_id: new Bson.ObjectId(id), token: token}) : await this.userdb.findOne({_id: new Bson.ObjectId(id)});

        // Si l'utilisateur existe bien on le return, sinon on return null
        if (user) return user;
        else return null;
    }
    
}