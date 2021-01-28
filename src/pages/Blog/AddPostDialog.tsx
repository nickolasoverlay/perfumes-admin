import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@material-ui/core";

import usePosts from "./../../hooks/usePosts";

import DialogTextField from "./../../ui/DialogTextField";
import { AddPostDialogFormProps } from "./types";

export interface CategoryDialogProps {
    close(): void;
    isOpen: boolean;
}

const AddPostDialog: React.FC<CategoryDialogProps> = (props) => {
    const { close, isOpen } = props;
    const { control, handleSubmit } = useForm<AddPostDialogFormProps>();
    const { pushPost } = usePosts();
    const history = useHistory();

    const onSubmit = (post: AddPostDialogFormProps) => {
        pushPost(post);
        close();
    };

    return (
        <Dialog open={isOpen} onClose={close} fullWidth>
            <DialogTitle>Новий пост</DialogTitle>
            <DialogContent>
                <Controller
                    name="title_en"
                    label="Назва (EN)"
                    control={control}
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    name="title_fr"
                    label="Назва (FR)"
                    control={control}
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    name="short_en"
                    label="Підзаголовок (EN)"
                    control={control}
                    defaultValue=""
                    as={DialogTextField}
                />
                <Controller
                    name="short_fr"
                    label="Підзаголовок (FR)"
                    control={control}
                    defaultValue=""
                    as={DialogTextField}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={close}>
                    Відміна
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    disableElevation
                >
                    Добавити
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPostDialog;
