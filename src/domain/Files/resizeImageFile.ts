

interface IResizedFile {
    file:File;
    originalWidth:number;
    originalHeight:number;
    resizedWidth:number;
    resizedHeight:number;
}


export const resizeImageFile = async (file:File, maxSize:number, nameQualifier?:string):Promise<IResizedFile> => {
    const image = document.createElement("img");
    await waitOnImageLoad(image, URL.createObjectURL(file));

    const dim = getResizedImageDimensions(maxSize, image);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", dim.width.toString());
    canvas.setAttribute("height", dim.height.toString());
    
    const ctx = canvas.getContext("2d")!;    
    ctx.drawImage(image, 0, 0, dim.width, dim.height);

    const dataUrl = canvas.toDataURL(file.type);
    const fileName = getFileNameWithQualifier(file.name, nameQualifier);

    return {
        originalWidth:image.width,
        originalHeight: image.height,
        resizedWidth: dim.width,
        resizedHeight: dim.height,
        file: dataURLtoFile(dataUrl, fileName)
    };
};

const getFileNameWithQualifier = (name:string, qualifier?:string) => {
    if (!qualifier) {
        return name;
    }
    const fileNameParts = name.split(".");
    const base = fileNameParts[0];
    const ext = fileNameParts[1];
    return ext ? `${fileNameParts[0]}${qualifier || ""}.${fileNameParts[1]}` :
        `${fileNameParts[0]}${qualifier || ""}`;
    
};


const waitOnImageLoad = (image:HTMLImageElement, src: string):Promise<any> => {
    const promise = new Promise((resolve, reject) => {
        image.addEventListener("load", () => { resolve(null); }, { once: true});
        image.addEventListener("error", () => { reject(); }, { once: true});
    });
    image.src = src;
    return promise;
};


interface IImageDimensions {
    width: number;
    height: number;
}


const getResizedImageDimensions = (max:number, image:IImageDimensions):IImageDimensions => {
    let { width, height } = image;
        
    if (width > height) {
        if (width > max) {
            height = Math.round(height * (max / width));
            width = max;
        }
    } else {
        if (height > max) {
            width = Math.round(width * (max / height));
            height = max;
        }
    }

    return { width, height };
};


const dataURLtoFile = (dataUrl:string, fileName:string):File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1])
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, {type:mime});
 };
