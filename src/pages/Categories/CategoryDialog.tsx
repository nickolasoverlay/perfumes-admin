import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
} from "@material-ui/core";

import DialogTextField from "./../../ui/DialogTextField";
import AutoComplete from "./../../ui/AutoComplete";

import { useForm, Controller } from "react-hook-form";

export interface CategoryDialogProps {
  onClose(): void;
  onAddCategory(category: any): void;
  isOpen: boolean;
  groups: any[];
}

const CategoryDialog = ({
  onClose,
  onAddCategory,
  isOpen,
}: CategoryDialogProps) => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Dialog onClose={onClose} open={isOpen} fullWidth>
      <DialogTitle>Категорія</DialogTitle>
      <DialogContent>
        <Controller
          name="nameEn"
          control={control}
          defaultValue=""
          label="Назва (EN)"
          as={DialogTextField}
        />
        <Controller
          name="nameFr"
          control={control}
          defaultValue=""
          label="Назва (FR)"
          as={DialogTextField}
        />
        <Controller
          name="shortEn"
          control={control}
          defaultValue=""
          label="Підазаголовок (EN)"
          as={DialogTextField}
        />
        <Controller
          name="shortFr"
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

export default CategoryDialog;
