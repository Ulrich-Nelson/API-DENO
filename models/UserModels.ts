import { db } from "../db/db.ts";
import { hash } from "../helpers/password.helpers.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { userRoleType, sexeType, subscriptionType } from "../types/roleTypes.ts";

export class UserModels implements UserInterfaces {

    protected userdb: any;

    private id: string | null | undefined;

    firstname: string;
    lastname: string;
    email: string;
    password:string;
    sexe: sexeType;
    role: userRoleType;
    dateNaissance: Date;
    subscription: subscriptionType;

    createdAt?: Date;
    updateAt?: Date;

    constructor(firstname: string, lastname: string, email: string, password: string, sexe: sexeType, role: userRoleType, dateNaissance: Date, subscription: subscriptionType ) {
        this.userdb = db.collection < UserInterfaces > ("users");
        this.firstname = firstname;
        this.lastname =  lastname;
        this.email = email;
        this.password = password;
        this.sexe = sexe;
        this.role = role;
        this.dateNaissance = dateNaissance;
        this.subscription = subscription;
    }

    get _id(): null | string | undefined {
        return (this.id === null) ? null : this.id;
    }

    async insert(): Promise < void > {
        const alreadyExist = this.userdb.findOne({email: this.email});
        if (alreadyExist) throw new Error('Un compte utilisant cette adresse mail est déjà enregistré');
        this.password = await hash(this.password);
        this.id = await this.userdb.insertOne({
            firstname : this.firstname,
            lastname : this.lastname,
            email : this.email,
            password : this.password,
            sexe : this.sexe,
            role : this.role,
            dateNaissance : this.dateNaissance,
            subscription : this.subscription,
        })
    }
    
}