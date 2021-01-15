import { db } from "../db/db.ts";
import { comparePass, hash } from "../helpers/password.helpers.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { userRoleType, sexeType, subscriptionType } from "../types/roleTypes.ts";

export class UserModels implements UserInterfaces {
    
    private userdb: any;
    static userdb = db.collection < UserInterfaces > ("users");
    
    _id: string | null | { $oid: string; } | undefined;
    
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

    constructor(firstname: string, lastname: string, email: string, password: string, sexe: sexeType, role: userRoleType, dateNaissance: Date, subscription: subscriptionType, 
        createdAt: Date = new Date(), updateAt: Date = new Date(), lastLogin: Date = new Date(), attempt: number = 0 ) {
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
        this._id = await this.userdb.insertOne({
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
        });
    };

    /**
     * Recherche un utilisateur en base de donné, et regarde si les credentials sont bon
     * Vérifie également le nombre de connexion d'affilé
     * @param email 
     * @param password 
     */
    static async login(email: string, password:string): Promise <UserInterfaces> {
        const user: UserInterfaces | undefined = await this.userdb.findOne({email: email});

        // Si aucun utilisateur n'a cet email
        if (!user) throw new Error('Email/password incorrect');

        // Si l'utilisateur à respecter les deux minutes d'attente on remet sont nombres d'essai à 0
        if(user.attempt >= 5  && ((new Date().getTime() - user.lastLogin.getTime()) / 1000 / 60) >= 2) {
            user.lastLogin = new Date();
            user.attempt = 0;
            this.userdb.updateOne({_id: user._id}, user);
        }

        // On vérifie le nombre de connnexion et le temps depuis la dernière connexion
        if(user.attempt >= 5  && ((new Date().getTime() - user.lastLogin.getTime()) / 1000 / 60) <= 2)
            throw new Error("Trop de tentative sur l'email "+ user.email +" (5 max) - Veuillez patienter (2min)");
        

        // On compare le mot de passe pour savoir si il peut se connecter ou non, et si non on ajoute un essai de connexion
        const comparePassword = await comparePass(password, user.password);
        if (!comparePassword) {
            user.lastLogin = new Date();
            user.attempt += 1;
            this.userdb.updateOne({_id: user._id}, user);
            throw new Error('Email/password incorrect');
        }

        // Si tout c'est bien passé dans la connexion, on remet les essais à 0
        user.lastLogin = new Date();
        user.attempt = 0;
        this.userdb.updateOne({_id: user._id}, user);

        return (user);
    }
    

    static async getOneUser(id: { $oid: string }): Promise <void> {
        const user = await this.userdb.findOne({_id: id});
        // console.log(user._id a);
    }
    
}