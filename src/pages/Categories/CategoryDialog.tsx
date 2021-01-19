import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  InputAdornment,
} from "@material-ui/core";
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
  groups,
}: CategoryDialogProps) => {
  const { control, handleSubmit } = useForm();

  return (
    <Dialog onClose={onClose} open={isOpen} fullWidth>
      <DialogTitle>Категорія</DialogTitle>
      <DialogContent>
        <Controller
          name="nameEn"
          control={control}
          defaultValue=""
          label="Назва (EN)"
          as={TextField}
        />
        <Controller
          name="nameFr"
          control={control}
          defaultValue=""
          label="Назва (FR)"
          as={TextField}
        />
        <Controller
          name="shortEn"
          control={control}
          defaultValue=""
          label="Підазаголовок (EN)"
          as={TextField}
        />
        <Controller
          name="shortFr"
          control={control}
          defaultValue=""
          label="Підзаголовок (FR)"
          as={TextField}
        />

        <Controller
          name="url"
          control={control}
          defaultValue=""
          label="Посилання"
          as={TextField}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Відміна
        </Button>
        <Button
          color="primary"
          onClick={onAddCategory}
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
