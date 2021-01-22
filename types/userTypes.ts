export type userRoleType = 'administrateur' | 'tuteur' | 'enfant';
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
    dateNaissance: Date,
    subscription: subscriptionType,

    createdAt: Date,
    updateAt: Date,

    token?: string,
    refreshToken?: string,

    lastLogin?: Date,
    attempt?: number
}