import React, { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";

import {
  TextField,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";

import { MoreVert as MoreVertIcon } from "@material-ui/icons";

import Snackbar from "../../ui/Snackbar";
import Bubble from "../../ui/Bubble";

const CategoryBlock = (props: any) => {
  const { control, handleSubmit } = useForm();

  const [blockAnchor, setBlockAnchor] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const closeSnackbar = () => setSnackbarOpen(false);

  const stopEditing = () => {
    setIsEditing(false);
  };

  const applyEdit = () => {};

  const getGroupURL = () => {
    const g = props.groups.find((gr: any) => gr.id === props.group_id);

    if (!g) return "";

    return g.url + "#" + props.url;
  };

  const getGroupPartialURL = () => {
    const g = props.groups.find((gr: any) => gr.id === props.group_id);

    if (!g) return "";

    return "https:/yva.com.ua/" + g.url + "#";
  };

  const getGroupName = () => {
    const g = props.groups.find((gr: any) => gr.id === props.group_id);

    if (!g) return "";

    return g.name_ua + "/" + g.name_ru;
  };

  return (
    <Bubble>
      <Snackbar
        open={snackbarOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        onClose={closeSnackbar}
      />
      {isEditing === true ? (
        <>
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
            label="Підзаголовок (EN)"
            as={TextField}
          />
          <Controller
            name="shortFr"
            control={control}
            defaultValue=""
            label="Підзаголовок (Fr)"
            as={TextField}
          />
          <Controller
            name="url"
            control={control}
            defaultValue=""
            label="Посилання"
            as={TextField}
          />
          <div className="Bubble--editgroup">
            <Button color="primary" onClick={stopEditing}>
              Відміна
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={applyEdit}
              disableElevation
            >
              Зберегти
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="Bubble--menu">
            <IconButton onClick={(e) => setBlockAnchor(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={blockAnchor}
              open={Boolean(blockAnchor)}
              onClose={() => setBlockAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setIsEditing(true);
                  setBlockAnchor(null);
                }}
              >
                Редагувати
              </MenuItem>
              <MenuItem className="red" onClick={props.delete}>
                Видалити
              </MenuItem>
            </Menu>
          </div>
          <Typography variant="button">
            Колекція: <span>{getGroupName()}</span>
          </Typography>
          <Typography variant="button">
            Назва (UA): <span></span>
          </Typography>
          <Typography variant="button">
            Назва (RU): <span></span>
          </Typography>
          <Typography variant="button">
            Товарів в категорії: <span>{props.items_available}</span>
          </Typography>
          <Typography variant="button" className="Bubble--url">
            Посилання:{" "}
            <span className="aqua">
              https://yva.com.ua/collections/
              {getGroupURL()}
            </span>
          </Typography>
        </>
      )}
    </Bubble>
  );
};
