export default interface BillInterfaces {
    _id?: { $oid: string } | string | null;

    user_id: { $oid: string } | string | undefined;

    id_Stripe: string;
    date_payement: Date;
    montant_ht: string;
    montant_ttc: string;
    source: string;

    createdAt: Date;
    updateAt: Date;
}