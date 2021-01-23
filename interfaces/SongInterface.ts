export default interface SongInterfaces {
    _id?: { $oid: string } | string | null,
    name: string,
    url: string,
    cover: string,
    time: string,
    type: string,
    createdAt: Date,
    updateAt: Date
}