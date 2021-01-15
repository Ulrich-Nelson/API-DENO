export default class DateException extends Error {

    constructor(message:string) {
        super(message)
    }

    /**
     * Vérification du format de la date "xxxx-xx-xx"
     * @param date 
     */
    static checkDate(date: string): boolean {
        const reg = /^\d{4}\-\d{1,2}\-\d{1,2}$/
        return (reg.test(date.toLowerCase().trim()))
    }

    /**
     * Vérification du format de la date et de l'heure "xxxx-xx-xx xx:xx:xx"
     * @param date 
     */
    static checkDateTime(date: string): boolean {
        const reg = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
        return (reg.test(date.toLowerCase().trim()))
    }
}