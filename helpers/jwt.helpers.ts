import { create, verify, decode, getNumericDate } from "https://deno.land/x/djwt@v2.0/mod.ts";
import { config } from '../config/config.ts';

// Fichier des différentes fonctions concernant le token

const {
    JWT_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXP,
    JWT_REFRESH_TOKEN_EXP,
} = config;

const header: any = {
    // alg: "HS256",
    alg: "none",
    typ: "JWT",
};

/**
 * Génère le token sur la base du user
 * @param user 
 */
const getAuthToken = async (user: any) => {
    const payload: any = {
        id: user._id,
        exp: getNumericDate(new Date().getTime() + parseInt(JWT_ACCESS_TOKEN_EXP)),
    };
    return (await create(header, payload, JWT_TOKEN_SECRET)).split('.')[1];
};

/**
 * Génère le refreshtoken sur la base du user
 * @param user 
 */
const getRefreshToken = async(user: any) => {
    const payload: any = {
        id: user._id,
        exp: getNumericDate(new Date().getTime() + parseInt(JWT_REFRESH_TOKEN_EXP)),
    };

    return await create(header, payload, JWT_TOKEN_SECRET);
};

/**
 * Récupération du payload du token
 * @param token 
 */
const getJwtPayload = async(token: string): Promise < any | null > => {
    try {
        const payload = await verify(token, JWT_TOKEN_SECRET, header.alg);
        if (payload) {
            return payload;
        }
        
    } catch (err) {
        return null
    }
};

export { getAuthToken, getRefreshToken, getJwtPayload };