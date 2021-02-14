export type userRoleType = 'Admin' | 'Tuteur' | 'Enfant';
export type sexeType = 'Homme' | 'Femme';
export type subscriptionType = 0 | 1;


export type allChildType = {
    
    _id?: { $oid: string } | string | null,
    id_parent?: { $oid: string } |string | null,

    firstname: string,
    lastname: string,
    email?: string,
    password?:string,
    sexe: sexeType,
    role: userRoleType,
    dateNaissance: string,
    subscription: subscriptionType,

    card?: Array<cardType>

    createdAt: Date,
    updateAt: Date,

    token?: string,
    refreshToken?: string,
    isActive?: boolean;
    lastLogin?: Date,
    attempt?: number
}

export type cardType = {
    id : number,
    cartNumber: string,
    month: string,
    year: string,
}