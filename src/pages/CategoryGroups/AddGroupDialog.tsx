import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@material-ui/core";

import { useForm, Controller } from "react-hook-form";

import DialogTextField from "./../../ui/DialogTextField";
import Autocomplete from "../../ui/AutoComplete";

type TypeOption = {
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

interface AddGroupDialogProps {
    onClose(): void;
    pushGroup(group: any): void;
    isOpen: boolean;
}

const AddGroupDialog = ({
    pushGroup,
    onClose,
    isOpen,
}: AddGroupDialogProps) => {
    const { control, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        pushGroup(data);
        onClose();
    };

    return (
        <Dialog onClose={onClose} open={isOpen} fullWidth>
            <DialogTitle>Добавлення групи</DialogTitle>
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
                    name="type"
                    control={control}
                    defaultValue={typeList[0].value}
                    render={(props) => {
                        return (
                            <Autocomplete
                                options={typeList}
                                defaultValue={typeList[0]}
                                getOptionLabel={(o: TypeOption) => o.name}
                                getOptionSelected={(
                                    option: TypeOption,
                                    value: TypeOption
                                ) => option.value === value.value}
                                onChange={(e: any, o: TypeOption) => {
                                    if (o) {
                                        props.onChange(o.value);
                                    }
                                }}
                            />
                        );
                    }}
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
                <Button color="primary">Відміна</Button>
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

export default AddGroupDialog;
