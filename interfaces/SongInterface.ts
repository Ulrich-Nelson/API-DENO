export default interface SongInterfaces {
    _id?: { $oid: string } | string | null,

    id_song?: number,
    name: string,
    url: string,
    cover: string,
    time: string,
    type: string,
    createdAt: Date,
    updateAt: Date
}