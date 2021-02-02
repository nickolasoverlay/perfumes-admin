export type Post = {
    id: number;
    created_at: number;
    published: boolean;
    likes: number;
    title_en: string;
    title_fr: string;
    short_en: string;
    short_fr: string;
    text_en: string;
    text_fr: string;
    wallpaper: string;
};

export type AddPostDialogFormProps = {
    title_en: string;
    title_fr: string;
    short_en: string;
    short_fr: string;
};
