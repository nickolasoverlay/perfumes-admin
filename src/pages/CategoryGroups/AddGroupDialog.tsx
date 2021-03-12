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

type AddGroupDialogProps = {
    close(): void;
    pushGroup(group: any): void;
    isOpen: boolean;
};

const AddGroupDialog: React.FC<AddGroupDialogProps> = (props) => {
    const { pushGroup, close, isOpen } = props;
    const { control, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        pushGroup(data);
        close();
    };

    return (
        <Dialog onClose={close} open={isOpen} fullWidth>
            <DialogTitle>Добавлення колекції</DialogTitle>
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
                    name="description_en"
                    control={control}
                    defaultValue=""
                    label="Опис (EN)"
                    as={DialogTextField}
                />
                <Controller
                    name="description_fr"
                    control={control}
                    defaultValue=""
                    label="Опис (FR)"
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
                                label="Розташування на сайті"
                                onChange={(o: TypeOption) => {
                                    props.onChange(o.value);
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

export default AddGroupDialog;
