import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { useForm, useWatch, Control, Controller } from "react-hook-form";

import useProduct from "./../../hooks/useProduct";
import useCategories from "./../../hooks/useCategories";
import useFilters from "./../../hooks/useFilters";

import {
    Button,
    FormControlLabel,
    Switch,
    Typography,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import DialogTextField from "./../../ui/DialogTextField";
import Spinner from "./../../ui/Spinner";
import Autocomplete from "./../../ui/AutoComplete";
import Imager from "./../../ui/Imager";

import DeleteProductDialog from "./DeleteProductDialog";

import { Product, ProductSizeType, productSizeTypes } from "./types";
import { Category } from "./../Categories/types";
import { Filter } from "./../Filters/types";

const ProductEditPage = (props: any) => {
    const { control, handleSubmit } = useForm<Product>();

    const {
        product,
        updateProduct,
        updateProductPictures,
        isLoading,
        isError,
    } = useProduct(props.match.params.product_id);
    const history = useHistory();

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    if (isLoading || isError) {
        return (
            <div className="product">
                <Spinner />
            </div>
        );
    }

    const handleCancel = () => {
        history.push("/products");
    };

    const onSubmit = (updatedProduct: Product) => {
        updateProduct({
            ...updatedProduct,
            id: product.id,
            pictures: product.pictures,
        });
        history.push("/products");
    };

    return (
        <div className="product">
            <DeleteProductDialog
                isOpen={openDeleteDialog}
                productId={product.id}
                close={handleCloseDeleteDialog}
            />
            <div className="ActionBar">
                <div className="ActionBar--title">
                    Продукти
                    <NavigateNextIcon />
                    {product.id}
                    <NavigateNextIcon />
                    Редагування
                </div>
                <Button
                    variant="contained"
                    color="secondary"
                    disableElevation
                    onClick={handleOpenDeleteDialog}
                >
                    Видалити
                </Button>
            </div>
            <div className="product_form triple_grid_column">
                <Controller
                    control={control}
                    name="name_en"
                    label="Назва (EN)"
                    defaultValue={product.name_en}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="name_fr"
                    label="Назва (FR)"
                    defaultValue={product.name_fr}
                    as={DialogTextField}
                />

                <CategoryChanger
                    control={control}
                    productId={product.id}
                    productCategoryId={product.category}
                />

                <FilterWatcherFromCategory
                    control={control}
                    productCategory={product.category}
                    productFilter={product.filter}
                />
                <Controller
                    control={control}
                    name="short_en"
                    label="Підзаголовок (EN)"
                    defaultValue={product.short_en}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="short_fr"
                    label="Підзаголовок (FR)"
                    defaultValue={product.short_fr}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="description_en"
                    label="Опис (EN)"
                    defaultValue={product.description_en}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="description_fr"
                    label="Опис (FR)"
                    defaultValue={product.description_fr}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="instruction_en"
                    label="Інструкція (EN)"
                    defaultValue={product.instruction_en}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="instruction_fr"
                    label="Інструкція (FR)"
                    defaultValue={product.instruction_fr}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="components_en"
                    label="Cклад (EN)"
                    defaultValue={product.components_en}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="components_fr"
                    label="Склад (FR)"
                    defaultValue={product.components_fr}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="firm_en"
                    label="Виробник (EN)"
                    defaultValue={product.firm_en}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="firm_fr"
                    label="Виробник (FR)"
                    defaultValue={product.firm_fr}
                    as={DialogTextField}
                />
                <div>
                    <Controller
                        control={control}
                        name="is_available"
                        defaultValue={product.is_available}
                        render={(props) => {
                            return (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={props.value}
                                            color="primary"
                                            onChange={(e) =>
                                                props.onChange(e.target.checked)
                                            }
                                            name="isAvailable"
                                        />
                                    }
                                    label={
                                        props.value
                                            ? "Товар доступний"
                                            : "Товар не доступний"
                                    }
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name="is_new"
                        defaultValue={product.is_new}
                        render={(props) => {
                            return (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={props.value}
                                            color="primary"
                                            onChange={(e) =>
                                                props.onChange(e.target.checked)
                                            }
                                            name="isNew"
                                        />
                                    }
                                    label={
                                        props.value
                                            ? "Помічати як новинку"
                                            : "Не помічати як новинку"
                                    }
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name="with_discount"
                        defaultValue={product.with_discount}
                        render={(props) => {
                            return (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={props.value}
                                            color="primary"
                                            onChange={(e) =>
                                                props.onChange(e.target.checked)
                                            }
                                            name="withDiscount"
                                        />
                                    }
                                    label={
                                        props.value
                                            ? "Товар акційний"
                                            : "Товар не акційний"
                                    }
                                />
                            );
                        }}
                    />
                </div>
                <Controller
                    control={control}
                    name="price"
                    defaultValue={product.price}
                    type="number"
                    render={(props) => {
                        return (
                            <DialogTextField
                                label="Ціна"
                                value={props.value}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    props.onChange(
                                        isNaN(Number(e.target.value))
                                            ? 0
                                            : Number(e.target.value)
                                    )
                                }
                            />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name="discount_price"
                    defaultValue={product.discount_price}
                    type="number"
                    render={(props) => {
                        return (
                            <DialogTextField
                                label="Акційна ціна"
                                value={props.value}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    props.onChange(
                                        isNaN(Number(e.target.value))
                                            ? 0
                                            : Number(e.target.value)
                                    )
                                }
                            />
                        );
                    }}
                />
                <Controller
                    name="size_type"
                    control={control}
                    defaultValue={productSizeTypes[0].key}
                    render={(props) => {
                        return (
                            <Autocomplete
                                options={productSizeTypes}
                                defaultValue={productSizeTypes[0]}
                                getOptionLabel={(sizeType: ProductSizeType) =>
                                    sizeType.label
                                }
                                label="Одиниці розміру"
                                getOptionSelected={(
                                    option: ProductSizeType,
                                    value: ProductSizeType
                                ) => option.key === value.key}
                                onChange={(o: ProductSizeType) => {
                                    props.onChange(o.key);
                                }}
                            />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name="size"
                    defaultValue={product.size}
                    type="number"
                    render={(props) => {
                        return (
                            <DialogTextField
                                label="Розмір"
                                value={props.value}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    props.onChange(
                                        isNaN(Number(e.target.value))
                                            ? 0
                                            : Number(e.target.value)
                                    )
                                }
                            />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name="additional_size"
                    defaultValue={product.additional_size}
                    type="number"
                    render={(props) => {
                        return (
                            <DialogTextField
                                label="Додатковий розмір"
                                value={props.value}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    props.onChange(
                                        isNaN(Number(e.target.value))
                                            ? 0
                                            : Number(e.target.value)
                                    )
                                }
                            />
                        );
                    }}
                />
            </div>
            <Imager
                entity="product"
                entityId={product.id}
                presentImages={product.pictures}
                onEditCommit={updateProductPictures}
            />
            <div className="edit_form_actions">
                <Button style={{ marginRight: 10 }} onClick={handleCancel}>
                    Відміна
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={handleSubmit(onSubmit)}
                >
                    Зберегти
                </Button>
            </div>
        </div>
    );
};

type CategoryWatcherProps = {
    control: Control<Product>;
    productId: number;
    productCategoryId: number;
};

const CategoryChanger: React.FC<CategoryWatcherProps> = (props) => {
    const { control, productCategoryId } = props;

    const categoriesFuture = useCategories();

    if (categoriesFuture.isLoading || categoriesFuture.isError) {
        return null;
    }
    const productCategory = categoriesFuture.categories.find(
        (f) => f.id === productCategoryId
    );

    return (
        <Controller
            name="category"
            control={control}
            defaultValue={productCategory?.id}
            render={(props) => {
                return (
                    <Autocomplete
                        options={categoriesFuture.categories}
                        defaultValue={productCategory}
                        getOptionLabel={(o: Category) => o.name_en}
                        label="Категорія"
                        getOptionSelected={(
                            option: Category,
                            value: Category
                        ) => option.id === value.id}
                        onChange={(o: Category) => {
                            props.onChange(o.id);
                        }}
                    />
                );
            }}
        />
    );
};

type FilterWatcherProps = {
    control: Control<Product>;
    productCategory: number;
    productFilter: number;
};

const FilterWatcherFromCategory: React.FC<FilterWatcherProps> = (props) => {
    const { control, productCategory, productFilter } = props;

    const watchCategory = useWatch({
        control: control,
        name: "category",
        defaultValue: productCategory,
    });

    const filtersFuture = useFilters();
    if (filtersFuture.isLoading) {
        return null;
    }

    const filters = filtersFuture.filters.filter((f) => f.id === watchCategory);

    return (
        <Controller
            name="filter"
            control={control}
            defaultValue={productFilter}
            render={(props) => {
                const filter = filters.find((f) => f.id === props.value);
                if (!filter) {
                    return (
                        <Typography variant="button">
                            Для цієї категорії недоступен жоден фільтр
                        </Typography>
                    );
                }

                return (
                    <Autocomplete
                        options={filters}
                        value={filter}
                        getOptionLabel={(o: Filter) => o.name_en}
                        label="Фільтр"
                        getOptionSelected={(option: Filter, value: Filter) =>
                            option.id === value.id
                        }
                        onChange={(o: Filter) => {
                            props.onChange(o.id);
                        }}
                    />
                );
            }}
        />
    );
};

export default ProductEditPage;
