import React from "react";
import { useForm, useWatch, Controller } from "react-hook-form";

import useCategories from "./../../hooks/useCategories";
import useFilters from "./../../hooks/useFilters";
import useProducts from "./../../hooks/useProducts";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    FormControlLabel,
    Switch,
} from "@material-ui/core";

import DialogTextField from "./../../ui/DialogTextField";
import Spinner from "./../../ui/Spinner";
import Autocomplete from "./../../ui/AutoComplete";

import { Product, ProductSizeType, productSizeTypes } from "./types";
import { Category } from "../Categories/types";
import { Filter } from "../Filters/types";

type AddProductDialogProps = {
    close(): void;
    isOpen: boolean;
};

const AddProductDialog = ({ close, isOpen }: AddProductDialogProps) => {
    const { control, handleSubmit } = useForm<Product>();
    const watchCategory = useWatch({
        control,
        name: "category",
        defaultValue: 1,
    });

    const categoriesFuture = useCategories();
    const filtersFuture = useFilters();
    const { pushProduct } = useProducts();

    if (
        categoriesFuture.isLoading ||
        categoriesFuture.isError ||
        filtersFuture.isLoading ||
        filtersFuture.isError
    ) {
        return (
            <Dialog open={isOpen} onClose={close} fullWidth scroll="paper">
                <DialogTitle>Добавлення продукту</DialogTitle>
                <DialogContent>
                    <Spinner />
                </DialogContent>
                <DialogActions>
                    <Button color="primary">Відміна</Button>
                    <Button
                        color="primary"
                        variant="contained"
                        disableElevation
                        disabled
                    />
                </DialogActions>
            </Dialog>
        );
    }

    const onSubmit = (product: Product) => {
        pushProduct(product);
        close();
    };

    if (categoriesFuture.isLoading) {
        return (
            <Dialog open={isOpen} onClose={close} fullWidth scroll="paper">
                <DialogTitle>Добавлення продукту</DialogTitle>
                <DialogContent>
                    <Spinner />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={close}>
                        Відміна
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        disableElevation
                        disabled
                    >
                        Добавити
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (categoriesFuture.isError || categoriesFuture.categories.length === 0) {
        return (
            <Dialog open={isOpen} onClose={close} fullWidth scroll="paper">
                <DialogTitle>Добавлення продукту</DialogTitle>
                <DialogContent>
                    <Typography variant="button">
                        Не вдалося завантажити категорії
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={close}>
                        Відміна
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        disableElevation
                        disabled
                    >
                        Добавити
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    const suitableFilters = filtersFuture.filters.filter(
        (f: Filter) => f.category === watchCategory
    );

    return (
        <Dialog open={isOpen} onClose={close} fullWidth scroll="paper">
            <DialogTitle>Добавлення товару</DialogTitle>
            <DialogContent>
                <Controller
                    control={control}
                    name="name_en"
                    label="Назва (EN)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="name_fr"
                    label="Назва (FR)"
                    defaultValue=""
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
                                defaultValue={categoriesFuture.categories[0]}
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
                        defaultValue={0}
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
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="short_fr"
                    label="Підзаголовок (FR)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="description_en"
                    label="Опис (EN)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="description_fr"
                    label="Опис (FR)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="instruction_en"
                    label="Інструкція (EN)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="instruction_fr"
                    label="Інструкція (FR)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="components_en"
                    label="Cклад (EN)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="components_fr"
                    label="Склад (FR)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="firm_en"
                    label="Виробник (EN)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="firm_fr"
                    label="Виробник (FR)"
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    control={control}
                    name="is_available"
                    defaultValue={true}
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
                    defaultValue={false}
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
                    defaultValue={false}
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
                <Controller
                    control={control}
                    name="price"
                    defaultValue={0}
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
                    defaultValue={0}
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
                    defaultValue={0}
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
                    defaultValue={0}
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
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={close}>
                    Відміна
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    onClick={handleSubmit(onSubmit)}
                >
                    Добавити
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductDialog;
