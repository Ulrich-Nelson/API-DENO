export default class PasswordException extends Error {
    constructor(message:string) {
        super(message)
    }

    /**
     * Vérification de si le mot de passe fait bien le nombre de caractère minimum
     * @param password 
     */
    static isValidPassword(password: string): boolean {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        if (password.length < 7 || password.length > 20) return false;
        else return regex.test(password)
    }
}
