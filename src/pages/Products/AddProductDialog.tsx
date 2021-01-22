import React from "react";
import { useForm, useWatch, Controller } from "react-hook-form";

import useCategories from "./../../hooks/useCategories";
import useFilters from "./../../hooks/useFilters";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@material-ui/core";

import DialogTextField from "./../../ui/DialogTextField";
import Spinner from "./../../ui/Spinner";
import Autocomplete from "./../../ui/AutoComplete";

import { Product } from "./types";
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
        console.log("product -> ", product);
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

    if (categoriesFuture.isError) {
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
            <DialogTitle>Добавлення продукту</DialogTitle>
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
                        defaultValue={suitableFilters[0].id}
                        render={(props) => {
                            const filter = suitableFilters.find(
                                (f: Filter) => f.id === props.value
                            );
                            return (
                                <Autocomplete
                                    options={suitableFilters}
                                    defaultValue={filter}
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
                    name="price"
                    label="Ціна"
                    defaultValue={0}
                    type="number"
                    as={DialogTextField}
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
