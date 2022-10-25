export class FileModel {
    constructor() {
        this.name = "";
        this.ownerUid = "";
        this.storagePath = "";
        this.url = "";
        this.thumbUrl = "";
        this.size = 0;
        this.updated = "";
        this.mediaTags = null;
    }
    get updatedDate() {
        return new Date(this.updated);
    }
    get thumbDescription() {
        return `${readableBytes(this.size)} (${this.updatedDate.toLocaleDateString()})`;
    }
    static toFirestore(file) {
        return {
            name: file.name,
            ownerUid: file.ownerUid,
            storagePath: file.storagePath,
            url: file.url,
            thumbUrl: file.thumbUrl,
            size: file.size,
            type: file.type,
            updated: file.updated,
            mediaTags: file.mediaTags
        };
    }
    static fromFirestore(snapshot) {
        const dbFile = snapshot.data();
        const fileModel = new FileModel();
        Object.assign(fileModel, dbFile);
        return fileModel;
    }
}
const readableBytes = (bytes) => {
    const thresh = 1024;
    const dp = 1;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10 ** dp;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
    return bytes.toFixed(dp) + ' ' + units[u];
};
