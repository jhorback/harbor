export const contentTypes = {
    text: {
        type: "text",
        name: "Text",
        description: "A rich text field",
        element: "hb-text-content"
    },
    image: {
        type: "image",
        name: "Image",
        description: "An image in the format of jpg, gif, png, etc.",
        element: "hb-image-content"
    }
    /*
    * Grid (thumb views of a collection of document links)
    * Audio (hb-audio-content)
    * SongLink - link to song document; may have different display settings
    * SongList - links to a list of songs
    * YouTube (hb-youtube-content)
    * YouTubeList (hb-youtube-list-content)
    */
};
export const docTypes = {
    doc: {
        type: "doc",
        name: "Document",
        description: "A flexible free-form page that can contain any content",
        element: "hb-doc-page",
        validContentTypes: [contentTypes.text.type, contentTypes.image.type]
    }
    /*
    * Album (hb-album-doc - album/albums) - Text (text), Album Art (Image), Release Date (custom), Songs (song-list)
    * Song (hb-song-doc - song/songs) - Description (text), Audio (audio), Lyrics (text), Release Date (custom)
    * Poetry (hb-poetry-doc - poetry/poetry) - Description, Poem(s)
    * Poem (hb-poem-doc - poem/poems) - Image (image), Poem (text)
    */
};
