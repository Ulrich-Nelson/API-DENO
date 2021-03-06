import { userRoleType, sexeType, subscriptionType, cardType } from "../types/userTypes.ts";

export default interface UserInterfaces {

    _id?: { $oid: string } | string | null;
    id_parent?: { $oid: string } | string | null;

    firstname: string;
    lastname: string;
    email: string;
    password:string;
    sexe: sexeType;
    role: userRoleType;
    dateNaissance: string;
    subscription: subscriptionType;

    card: Array<cardType>
    
    createdAt: Date;
    updateAt: Date;

    token: string;
    refreshToken: string;

    lastLogin: Date;
    attempt: number;
    // supprimer le compte d'un utilisateur
    isActive: boolean;
}