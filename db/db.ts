import { config } from '../config/config.ts';
import { MongoClient } from "https://deno.land/x/mongo@v0.20.1/mod.ts";

// Connection à la base de données
const client = new MongoClient();
console.log(config.DB_URL);
await client.connect(config.DB_URL);

export const db = client.database("API-DENO");
