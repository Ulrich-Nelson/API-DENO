export default class PasswordException extends Error {
    constructor(message:string) {
        super(message)
    }

    static isValidPassword(password: string): boolean {
        return password.length >= 6;
    }
}
