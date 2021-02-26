import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@material-ui/core";

import { useForm, Controller } from "react-hook-form";
import useCategories from "./../../hooks/useCategories";
import useFilters from "./../../hooks/useFilters";

import DialogTextField from "../../ui/DialogTextField";
import Autocomplete from "../../ui/AutoComplete";

import { Filter } from "./types";
import { Category } from "./../Categories/types";
import Spinner from "../../ui/Spinner";

type AddFilterDialogProps = {
    isOpen: boolean;
    close(): void;
};

const AddFilterDialog: React.FC<AddFilterDialogProps> = ({ isOpen, close }) => {
    const { control, handleSubmit } = useForm<Filter>();

    const categoriesFuture = useCategories();
    const { pushFilter } = useFilters();

    const onSubmit = (filter: Filter) => {
        pushFilter(filter);
        close();
    };

    if (categoriesFuture.isLoading) {
        return (
            <Dialog open={isOpen} onClose={close} fullWidth>
                <DialogTitle>Добавлення нового фільтру</DialogTitle>
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
            <Dialog open={isOpen} onClose={close} fullWidth>
                <DialogTitle>Добавлення нового фільтру</DialogTitle>
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

    return (
        <Dialog open={isOpen} onClose={close} fullWidth>
            <DialogTitle>Добавлення нового фільтру</DialogTitle>
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
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant="text" onClick={close}>
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

export default AddFilterDialog;
