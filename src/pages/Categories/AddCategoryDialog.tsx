import React from "react";

import { useForm, Controller } from "react-hook-form";

import useGroups from "./../../hooks/useGroups";
import useCategories from "./../../hooks/useCategories";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@material-ui/core";

import DialogTextField from "../../ui/DialogTextField";
import Autocomplete from "../../ui/AutoComplete";
import Spinner from "../../ui/Spinner";

import { Category } from "./types";
import { Group } from "../CategoryGroups/types";

export interface CategoryDialogProps {
    onClose(): void;
    isOpen: boolean;
    groups: any[];
}

const AddCategoryDialog = ({ onClose, isOpen }: CategoryDialogProps) => {
    const { groups, isLoading, isError } = useGroups();
    const { pushCategory } = useCategories();

    const { control, handleSubmit } = useForm<Category>();

    const onSubmit = (category: Category) => {
        pushCategory(category);
        onClose();
    };

    if (isLoading) {
        return (
            <Dialog onClose={onClose} open={isOpen} fullWidth>
                <DialogTitle>Добавлення категорії</DialogTitle>
                <DialogContent>
                    <Spinner />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={onClose}>
                        Відміна
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled
                        disableElevation
                    >
                        Добавити
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (isError) {
        return (
            <Dialog onClose={onClose} open={isOpen} fullWidth>
                <DialogTitle>Добавлення категорії</DialogTitle>
                <DialogContent>
                    <Typography variant="button">
                        Не вдалося завантажити категорії
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={onClose}>
                        Відміна
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled
                        disableElevation
                    >
                        Добавити
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog onClose={onClose} open={isOpen} fullWidth>
            <DialogTitle>Добавлення категорії</DialogTitle>
            <DialogContent>
                <Controller
                    name="name_en"
                    control={control}
                    defaultValue=""
                    label="Назва (EN)"
                    as={DialogTextField}
                />
                <Controller
                    name="name_fr"
                    control={control}
                    defaultValue=""
                    label="Назва (FR)"
                    as={DialogTextField}
                />
                <Controller
                    name="group_id"
                    control={control}
                    defaultValue={groups[0].id}
                    render={(props) => {
                        return (
                            <Autocomplete
                                options={groups}
                                defaultValue={groups[0]}
                                getOptionLabel={(o: Group) => o.name_en}
                                label="Колекція"
                                getOptionSelected={(
                                    option: Group,
                                    value: Group
                                ) => option.id === value.id}
                                onChange={(o: Group) => {
                                    props.onChange(o.id);
                                }}
                            />
                        );
                    }}
                />
                <Controller
                    name="short_en"
                    control={control}
                    defaultValue=""
                    label="Підазаголовок (EN)"
                    as={DialogTextField}
                />
                <Controller
                    name="short_fr"
                    control={control}
                    defaultValue=""
                    label="Підзаголовок (FR)"
                    as={DialogTextField}
                />

                <Controller
                    name="url"
                    control={control}
                    defaultValue=""
                    label="Посилання"
                    as={DialogTextField}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>
                    Відміна
                </Button>
                <Button
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    disableElevation
                >
                    Добавити
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCategoryDialog;
