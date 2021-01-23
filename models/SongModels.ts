import { db } from "../db/db.ts";
import SongInterfaces from "../interfaces/SongInterface.ts";
import { Bson } from "https://deno.land/x/mongo@v0.20.1/mod.ts";
export class SongModels implements SongInterfaces {

    private songdb: any;
    private static songdb = db.collection < SongInterfaces > ("songs");

    _id?: { $oid: string } | string | null;
    name: string;
    url: string;
    cover: string;
    time: string;
    type: string;
    createdAt: Date;
    updateAt: Date;
    

    constructor(name: string, url: string, cover: string, time: string, type: string) {
        this.songdb = db.collection < SongInterfaces > ("songs");
        this.name = name;
        this.url = url;
        this.cover = cover;
        this.time = time;
        this.type = type;
        this.createdAt = new Date();
        this.updateAt = new Date();
    }

    /**
     * Insertion d'un son en base de données
     */
    async insert(): Promise < void > {
        const toInsert = {
            name: this.name,
            url: this.url,
            cover: this.cover,
            time: this.time,
            type: this.type,
            createdAt: this.createdAt,
            updateAt: this.updateAt,
        }
        this._id =  await this.songdb.insertOne(toInsert);
    }

    /**
     * Récupération d'un son
     * @param idSong 
     */
    static async getOneSong (idSong: string): Promise<SongInterfaces | null> {
            if (idSong.length === 24) {
                const song = await this.songdb.findOne({_id: new Bson.ObjectId(idSong)});
                if (song) return song
                else return null;
            } else {
                throw new Error('Aucun son ne correspond à cet id');
            }
    }

    /**
     * Récupération de tout les sons
     */
    static async getAllSongs(): Promise<SongInterfaces[]> {
        const songs = await this.songdb.find().toArray();

        songs.map((item) => {
            console.log(item);
            Object.assign(item, {id: item._id});
            delete item._id;
        })

        if (songs) return songs;
        else return [];
    }
}