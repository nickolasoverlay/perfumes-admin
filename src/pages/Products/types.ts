export type Product = {
    id: number;
    category: number;
    name_en: string;
    name_fr: string;
    short_en: string;
    short_fr: string;
    description_en: string;
    description_fr: string;
    instruction_en: string;
    instruction_fr: string;
    components_en: string;
    components_fr: string;
    firm_en: string;
    firm_fr: string;

    pictures: string;
    size_type: number;
    size: number;
    additional_size: number;
    price: number;
    with_discount: boolean;
    discount_price: number;
    is_new: boolean;
    is_deleted: boolean;
    is_available: boolean;
    quantity_available: number;

    filter: number;
};

export type ProductSizeType = {
    key: number;
    label: string;
};

export const productSizeTypes: ProductSizeType[] = [
    { key: 1, label: "Мілілітри (МЛ)" },
    { key: 2, label: "Міліграми (МГ)" },
    { key: 3, label: "Грами (ГМ)" },
    { key: 4, label: "Шт" },
];
