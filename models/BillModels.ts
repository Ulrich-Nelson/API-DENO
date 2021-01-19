import { db } from "../db/db.ts";
import BillInterfaces from "../interfaces/BillInterfaces.ts";
import { Bson } from "https://deno.land/x/mongo@v0.21.2/mod.ts";

export class BillModels implements BillInterfaces {

    private billdb: any;
    private static billdb = db.collection < BillInterfaces > ("bills");
    
    _id?: { $oid: string } | string | null;

    user_id: string;
    id_Stripe: string;
    date_payement: Date;
    montant_ht: string;
    montant_ttc: string;
    source: string;

    createdAt: Date;
    updateAt: Date;

    constructor(user_id: string, id_Stripe: string, date_payement: Date, montant_ht: string, montant_ttc: string, source: string, createdAt: Date = new Date(), updateAt: Date = new Date()) {
        this.billdb = db.collection < BillInterfaces > ("bills");
        this.user_id = user_id;
        this.id_Stripe = id_Stripe;
        this.date_payement = new Date(date_payement);
        this.montant_ht = montant_ht;
        this.montant_ttc = montant_ttc;
        this.source = source;
        this.createdAt = createdAt;
        this.updateAt = updateAt;
    }

    /**
     * Insertion d'une facture en base de données
     */
    async insert(): Promise < void > {
        this._id = await this.billdb.insertOne({
            user_id : new Bson.ObjectId(this.user_id),
            id_Stripe : this.id_Stripe,
            date_payement : this.date_payement,
            montant_ht : this.montant_ht,
            montant_ttc : this.montant_ttc,
            source : this.source,
            createdAt: this.createdAt,
            updateAt: this.updateAt,
        });
    };

    /**
     * Récupération d'une facture par son id
     * @param bill_id MongoDB ID
     */
    static async getOneBill(bill_id: string): Promise <BillInterfaces | null> {

        // Récupération de la facture
        const bill = await this.billdb.findOne({_id: new Bson.ObjectId(bill_id)});

        // Si la facture existe bien on la return, sinon on return null
        if (bill) return bill;
        else return null;
    }

    /**
     * Récupération des factures d'un utilisateur
     * @param user_id MongoDB ID
     */
    static async getAllBill(user_id: string): Promise <BillInterfaces[]> {

        // Récupération des factures
        const bills = await this.billdb.find({user_id: user_id}).toArray();

        // On enlève les données inutiles
        bills.map((item) => {
            Object.assign(item, {id: item._id});
            item._id = undefined;
            item.user_id = undefined;
        });

        // Si la ou les facture existe bien on la return, sinon on return null
        if (bills) return bills;
        else return [];
    }
}