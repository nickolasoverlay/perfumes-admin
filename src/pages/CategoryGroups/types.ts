export type Group = {
    id: number;
    type: number;
    name_en: string;
    name_fr: string;
    url: string;
    wallpaper: string;
    is_deleted: boolean;
};

export type TypeOption = {
    value: number;
    name: string;
};

export const typeList: TypeOption[] = [
    {
        value: 1,
        name: "Показувати в колекціях",
    },
    {
        value: 2,
        name: "Показувати в аксесуарах",
    },
];
