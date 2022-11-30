export class FileModel {
    constructor() {
        this.name = "";
        this.uploaderUid = "";
        this.storagePath = "";
        this.url = "";
        this.thumbUrl = "";
        this.pictureFileName = null;
        this.pictureUrl = "";
        this.size = 0;
        this.type = null;
        this.width = null;
        this.height = null;
        this.updated = "";
        this.mediaTags = null;
    }
    get defaultThumb() {
        return "/content/thumbs/files-thumb.svg";
    }
    get updatedDate() {
        return new Date(this.updated);
    }
    get thumbDescription() {
        return `${readableBytes(this.size)} (${this.updatedDate.toLocaleDateString()})`;
    }
    get readableSize() {
        return readableBytes(this.size);
    }
    static toFirestore(file) {
        return {
            name: file.name,
            uploaderUid: file.uploaderUid,
            storagePath: file.storagePath,
            url: file.url,
            thumbUrl: file.thumbUrl,
            pictureFileName: file.pictureFileName,
            pictureUrl: file.pictureUrl,
            size: file.size,
            type: file.type,
            width: file.width,
            height: file.height,
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
