import { QueryDocumentSnapshot } from "firebase/firestore";
import { IFileData, IMediaTags } from "../interfaces/FileInterfaces";



export class FileModel implements IFileData {
    name: string = "";
    uploaderUid: string = "";
    storagePath: string = "";
    url: string = "";
    thumbUrl: string = "";
    pictureUrl: string = "";
    size: number = 0;
    type?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    updated: string = "";
    mediaTags: IMediaTags | null = null;

    get updatedDate() {
        return new Date(this.updated);
    }

    get thumbDescription() {
        return `${readableBytes(this.size)} (${this.updatedDate.toLocaleDateString()})`;
    }

    static toFirestore(file:FileModel):IFileData {
        return {
            name: file.name,
            uploaderUid: file.uploaderUid,
            storagePath: file.storagePath,
            url: file.url,
            thumbUrl: file.thumbUrl,
            pictureUrl: file.pictureUrl,
            size: file.size,
            type: file.type,
            width: file.width,
            height: file.height,
            updated: file.updated,
            mediaTags: file.mediaTags
        };
    }
    
    static fromFirestore(snapshot: QueryDocumentSnapshot):FileModel {
        const dbFile = snapshot.data() as IFileData;
        const fileModel = new FileModel();
        Object.assign(fileModel, dbFile);
        return fileModel;
    }
}



const readableBytes = (bytes:number):string => {
    const thresh = 1024;
    const dp = 1;
  
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
  
    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }
