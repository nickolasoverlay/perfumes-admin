import React, { useState } from "react";

import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  TextField,
  Button,
} from "@material-ui/core";

import { useForm, Controller } from "react-hook-form";

import DialogTextField from "./../../ui/DialogTextField";
import Autocomplete from "../../ui/AutoComplete";

export const typeList = [
  {
    type: 1,
    name: "Показувати в колекціях",
  },
  {
    type: 2,
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
  const { control, register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);

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
