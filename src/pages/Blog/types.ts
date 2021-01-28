export type PostEntry = {
    type: "pararapgh" | "title" | "paragraph";
    content: string;
};

export type Post = {
    id: number;
    created_at: number;
    published: boolean;
    likes: number;
    title_en: string;
    title_fr: string;
    short_en: string;
    short_fr: string;
    wallpaper: string;
    entries: PostEntry[];
};

export type AddPostDialogFormProps = {
    title_en: string;
    title_fr: string;
    short_en: string;
    short_fr: string;
};
