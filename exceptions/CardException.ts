export default class CardException extends Error {

    constructor(message:string) {
        super(message)
    }


    /**
     * Vérification format numéro carte
     * @param cardNumber 
     */
    static checkCardNumber(cardNumber: string) : boolean {
        if(cardNumber.trim().length !== 16 ) {
            return false;
        }
        const reg = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
        return (reg.test(cardNumber));
    }

    /**
     * Vérification format month
     * @param month 
     */
    static checkCardMonth(month: string) : boolean {
        return !(month.length !== 2 || parseInt(month) < 1 || parseInt(month) > 12);
    }

    /**
     * Vérification format year
     * @param year 
     */
    static checkCardYear(year: string) : boolean {
        return !(year.length !== 2);
    }

    /**
     * Vérification format year
     * @param year 
     */
    static checkDefault(defaut: string | boolean) : boolean {
        if (defaut !== true && defaut !== false) {
            return false
        }
        return true;
    }

    /**
     * Vérification format year
     * @param year 
     */
    static checkCVC(cvc: number) : boolean {
        return !(cvc.toString().length !== 3 || cvc < 0);
    }
}