import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import { config } from '../config/config.ts';

/**
 * Fonction pour envoyer un email, return true si l'email est parti et false si il y a une erreur.
 * @param email 
 */
const sendMail = async(email: string): Promise<void> => {
    try {
        const client = new SmtpClient();
    
        await client.connectTLS({
            hostname: "smtp.gmail.com",
            port: 465,
            username: "uber.eedsi.noreply@gmail.com",
            password: config.EMAIL_PASSWORD,
        });
    
        await client.send({
            from: "DENO - EEDSI",
            to: email,
            subject: "Mail de l'application deno",
            content: "Ce mail contient des chose très intéressante",
            html: "<a href='https://github.com'>Github</a>",
        });
    
        await client.close();
    } catch (err) {
        console.log(err);
    }

}

export { sendMail };