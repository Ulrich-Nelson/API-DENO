export default class PasswordException extends Error {
    constructor(message:string) {
        super(message)
    }

    /**
     * Vérification de si le mot de passe fait bien le nombre de caractère minimum
     * @param password 
     */
    static isValidPassword(password: string): boolean {
        return password.length >= 6;
    }
}
