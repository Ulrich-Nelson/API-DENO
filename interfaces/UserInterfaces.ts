import { userRoleType, sexeType, subscriptionType } from "../types/roleTypes.ts";

export default interface UserInterfaces {

    _id?: { $oid: string } | string | null;
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

    token: string;
    refreshToken: string;

    lastLogin: Date;
    attempt: number;
}