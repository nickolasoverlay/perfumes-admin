import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { useForm, useWatch, Controller } from "react-hook-form";

import useProduct from "./../../hooks/useProduct";
import useCategories from "./../../hooks/useCategories";
import useFilters from "./../../hooks/useFilters";

import { Button, FormControlLabel, Switch } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import DialogTextField from "./../../ui/DialogTextField";
import Spinner from "./../../ui/Spinner";
import Autocomplete from "./../../ui/AutoComplete";

import DeleteProductDialog from "./DeleteProductDialog";

import { Product, ProductSizeType, productSizeTypes } from "./types";
import { Category } from "./../Categories/types";
import { Filter } from "./../Filters/types";

const ProductEditPage = (props: any) => {
    const { control, handleSubmit } = useForm<Product>();
    const watchCategory = useWatch({
        control,
        name: "category",
        defaultValue: 1,
    });

    const { product, updateProduct, isLoading, isError } = useProduct(
        props.match.params.product_id
    );
    const categoriesFuture = useCategories();
    const filtersFuture = useFilters();

    const history = useHistory();

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    if (
        isLoading ||
        isError ||
        categoriesFuture.isLoading ||
        categoriesFuture.isError ||
        filtersFuture.isLoading ||
        filtersFuture.isError
    ) {
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
        });
        history.push("/products");
    };

    const suitableFilters = filtersFuture.filters.filter(
        (f: Filter) => f.category === watchCategory
    );
    const getCurrentFilter = (): Filter => {
        const currentFilter = suitableFilters.find(
            (f: Filter) => f.id === product.filter
        );

        if (!currentFilter) {
            return suitableFilters[0];
        }

        return currentFilter;
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
                <Controller
                    name="category"
                    control={control}
                    defaultValue={categoriesFuture.categories[0].id}
                    render={(props) => {
                        return (
                            <Autocomplete
                                options={categoriesFuture.categories}
                                value={categoriesFuture.categories[0]}
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

                {suitableFilters.length > 0 && (
                    <Controller
                        name="filter"
                        control={control}
                        defaultValue={getCurrentFilter().id}
                        render={(props) => {
                            return (
                                <Autocomplete
                                    options={suitableFilters}
                                    getOptionLabel={(o: Filter) => o.name_en}
                                    label="Фільтр"
                                    getOptionSelected={(
                                        option: Filter,
                                        value: Filter
                                    ) => option.id === value.id}
                                    onChange={(o: Filter) => {
                                        props.onChange(o.id);
                                    }}
                                />
                            );
                        }}
                    />
                )}
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
                    defaultValue={product.short_en}
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="description_fr"
                    label="Опис (FR)"
                    defaultValue={product.short_fr}
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

export default ProductEditPage;
