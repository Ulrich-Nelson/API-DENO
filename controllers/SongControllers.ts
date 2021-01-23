import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { sendResponse } from "../helpers/response.helpers.ts";
import { play } from "https://deno.land/x/audio@0.1.0/mod.ts";
import { SongModels } from "../models/SongModels.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";

export class SongControllers {

    /**
     * Get a Song function (POST /songs/)
     * @param req 
     * @param res 
     */
    static createOneSong = async(req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const {name, url, cover, time, type} = req.body;

            // Vérification de si toutes les données existe
            if (!name || !url || !cover || !time || !type) throw new Error ('Une ou plusieurs données obligatoire sont manquantes');
            
            // Instanciation d'un son
            const song = new SongModels(name, url, cover, time, type);

            // Insertion du son
            await song.insert();

            // Création de la réponse
            const body = {
                error: false, 
                message: "Le son a bien été créé avec succès",
                song: {
                    id: song._id,
                    name: song.name,
                    url: song.url,
                    cover: song.cover,
                    time: song.time,
                    type: song.type,
                    createdAt: song.createdAt,
                    updateAt: song.updateAt,
                }
            }

            // Envoi de la réponse
            sendResponse(res, 200, body)

        } catch (err) {

            // Création de la réponse d'erreur
            const body = { error: true, message: err.message }
            if (err.message === 'Une ou plusieurs données obligatoire sont manquantes')sendResponse(res, 400, body);
        }
    }

    /**
     * Get all Songs function (GET /songs)
     * @param req 
     * @param res 
     */
    static getAllSongs = async(req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserInterfaces = request.user;

            // Vérification de l'abonnement de l'utilisateur
            if(user.subscription !== 1) throw new Error("Votre abonnement ne permet pas d'accéder à la ressource");

            // Récupération du son par rapport à l'id
            const songs = await SongModels.getAllSongs();

            // Création de la réponse
            const body = {
                error: false, 
                songs: songs
            }
            sendResponse(res, 201, body);
        } catch (err) {
            // Création de la réponse d'erreur
            const body = { error: true, message: err.message }
            if (err.message === "Votre abonnement ne permet pas d'accéder à la ressource") sendResponse(res, 403, body);
        }
    }

    /**
     * Get a Song function (GET /songs/:id)
     * @param req 
     * @param res 
     */
    static getOneSong = async(req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const request: any = req;
            const user: UserInterfaces = request.user;

            // Vérification de l'abonnement de l'utilisateur
            if(user.subscription !== 1) throw new Error("Votre abonnement ne permet pas d'accéder à la ressource");

            // Récupération du son par rapport à l'id
            const song = await SongModels.getOneSong(req.params.id);
            if (!song) throw new Error('Aucun son ne correspond à cet id');

            // Création de la réponse
            const body = {
                error: false, 
                songs: {
                    id: song._id,
                    name: song.name,
                    url: song.url,
                    cover: song.cover,
                    time: song.time,
                    type: song.type,
                    createdAt: song.createdAt,
                    updateAt: song.updateAt,
                }
            }
            sendResponse(res, 200, body);
        } catch (err) {
            // Création de la réponse d'erreur
            const body = { error: true, message: err.message }
            if (err.message === "Aucun son ne correspond à cet id") sendResponse(res, 409, body);
            if (err.message === "Votre abonnement ne permet pas d'accéder à la ressource") sendResponse(res, 403, body);
        }

    }

    /**
     * Get all Songs function (GET /songs/play)
     * @param req 
     * @param res 
     */
    static playSong = async(req: Request, res: Response) => {
        const filename = 'C:/Users/seb_l/Desktop/Application web/API-DENO/public/assets/mp3/file.mp3';
        await play(filename);
    }

}