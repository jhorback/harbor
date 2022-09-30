

export interface IThumbnail {
    title: string;
    thumbUrl: string|null;
    thumbDescription: string|null;
    href: string;
}

export interface IListItem {
    uid: string;
    icon: string;
    text: string;
    description: string|null;
}
