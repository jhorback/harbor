import { contentTypes, TextContent } from "../content/contentTypes";
export const docTypes = {
    doc: {
        type: "doc",
        name: "Document",
        route: "docs",
        description: "A flexible free-form page that can contain any content",
        element: "hb-doc-page",
        validContentTypes: [contentTypes.text.type, contentTypes.image.type],
        defaultContent: [new TextContent()],
        icon: "article",
        defaultThumbUrl: "/content/thumbs/default-doc-thumb.png"
    },
    photo: {
        type: "photo",
        name: "Photo",
        route: "photos",
        description: "Some other text that may be a bit longer so it will be forced to wrap on a different line",
        element: "hb-doc-page",
        validContentTypes: [contentTypes.text.type, contentTypes.image.type],
        defaultContent: [new TextContent()],
        icon: "image",
        defaultThumbUrl: "/content/thumbs/default-doc-thumb.png"
    }
    /*
    * Album (hb-album-doc - album/albums) - Text (text), Album Art (Image), Release Date (custom), Songs (song-list)
    * Song (hb-song-doc - song/songs) - Description (text), Audio (audio), Lyrics (text), Release Date (custom)
    * Poetry (hb-poetry-doc - poetry/poetry) - Description, Poem(s)
    * Poem (hb-poem-doc - poem/poems) - Image (image), Poem (text)
    */
};
