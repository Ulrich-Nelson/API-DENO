export default class EmailException extends Error {
    constructor(message:string) {
        super(message)
    }

    /**
     * Vérification de si l'email est bien au bon format
     * @param email 
     */
    static checkEmail(email: string): boolean {
        if(email.length > 150 || email.length < 10) {
            return false;
        }
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return (reg.test(email.toLowerCase().trim()))
    }

}