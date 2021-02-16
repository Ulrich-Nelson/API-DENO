export default class UserException extends Error {
    constructor(message:string) {
        super(message)
    }

    /**
     * V"rification de la taille
     * @param lastname 
     */
    static checkNameLength(data: string) : boolean {
        return !(data.trim().length < 2 || data.trim().length > 25);
    }
}