/*
    Reasons for extracting the picture

    Set the base64 in upload panel

    be able to set the thumbnail when viewing in the file viewer
    - can be done using the base64 image when querying the files

    Use as album art when creating an album
    - can provide function to extract picture data array

    Set as poster url on text content

    ANSWER
    Add data array to Files in db
    Add method to convert data array to File - for adding to storage
    Add method to convert data array to base64 - for showing thumb in files
    So Media files will have
    id:storage/ref/path
        title
        url
        thumbUrl (can be base64 or URL to storage location)
        size
        type
        created
        updated
        mediaTags: IMediaTags
    */
export const extractMediaTags = async (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            await loadScript();
        }
        catch (error) {
            reject(error);
        }
        window.jsmediatags.read(file, {
            onSuccess: (jsmt) => resolve({
                title: jsmt.tags.title,
                artist: jsmt.tags.artist,
                album: jsmt.tags.album,
                year: parseInt(jsmt.tags.year),
                track: parseInt(jsmt.tags.track),
                genre: jsmt.tags.genre,
                picture: jsmt.tags.picture
            }),
            onError: (error) => reject(error)
        });
    });
};
let addedScript = false;
const loadScript = () => {
    return new Promise((resolve, reject) => {
        if (addedScript) {
            resolve();
        }
        if (!addedScript) {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js";
            document.body.append(script);
            script.onload = () => {
                resolve();
            };
            script.onerror = () => {
                reject();
            };
            addedScript = true;
        }
    });
};
export const convertPictureToFile = (name, pictureData) => new File([new Blob([new Uint8Array(pictureData)])], name);
export const convertPictureToBase64Src = (picture) => `data:${picture.format};base64,${window.btoa(picture.data.reduce((base64String, data) => base64String + String.fromCharCode(data), ""))}`;
