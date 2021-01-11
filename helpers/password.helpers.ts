import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

// Fichier des différentes fonctions concernant le mot de passe

/**
 * Encrypte le mot de passe
 * @param password 
 */
const hash = async(password: string):Promise<string>=>{
    return await bcrypt.hash(password);
}

/**
 * Compare deux mot de passe (un non-chiffré et un chiffré)
 * @param password 
 */
const comparePass = async(password: string, hash: string):Promise<boolean> =>{
    return await bcrypt.compare(password, hash);
}

export { hash, comparePass };