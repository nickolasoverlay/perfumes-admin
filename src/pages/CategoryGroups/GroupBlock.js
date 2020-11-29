import React, { useState, useEffect } from "react"

import axios from "axios"

import {
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@material-ui/core"

import { MoreVert as MoreVertIcon } from "@material-ui/icons"

import Bubble from "./../../ui/Bubble"
import Snackbar from "./../../ui/Snackbar"
import Autocomplete from "./../../ui/AutoComplete"

import { typeList } from "./AddGroupDialog"

const GroupBlock = (props) => {
  const [nameUA, setNameUA] = useState(props.name_ua)
  const [nameRU, setNameRU] = useState(props.name_ru)
  const [url, setURL] = useState(props.url)
  const [type, setType] = useState(props.type)

  const [newNameUA, setNewNameUA] = useState(props.name_ua)
  const [newNameRU, setNewNameRU] = useState(props.name_ru)
  const [newURL, setNewURL] = useState(props.url)
  const [newType, setNewType] = useState(props.type)

  const [blockAnchor, setBlockAnchor] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const closeSnackbar = () => setSnackbarOpen(false)

  const stopEditing = () => {
    setNewNameUA("")
    setNewNameRU("")
    setNewURL("")
    setNewType(0)

    setIsEditing(false)
  }

  const applyEdit = () => {
    if (
      (newNameUA !== nameUA && newNameUA.length !== 0) ||
      (newNameRU !== nameRU && newNameRU.length !== 0) ||
      (newURL !== url && newURL.length !== 0) ||
      (newType !== type)
    ) {
      let updatedCategory = new FormData()

      updatedCategory.append("id", props.id)
      updatedCategory.append("nameUA", newNameUA)
      updatedCategory.append("nameRU", newNameRU)
      updatedCategory.append("url", newURL)
      updatedCategory.append("type", newType)

      axios
        .post("/admin/category_groups/update/", updatedCategory)
        .then((res) => {
          setSnackbarSeverity("success")
          setSnackbarMessage("Колекцію успішно оновлено")
          setSnackbarOpen(true)

          if (newNameUA !== "") {
            setNameUA(newNameUA)
          }
          if (newNameRU !== "") {
            setNameRU(newNameRU)
          }
          if (newURL !== "") {
            setURL(newURL)
          }
          if (newType !== 0) {
            setType(newType)
          }
        })
        .catch((err) => {
          setSnackbarSeverity("error")
          setSnackbarMessage("Не вдалось оновити колекцію")
          setSnackbarOpen(true)

          console.log("UPDATE_CATEGORY_GROUP_ERR: ", err)
        })
    }

    setIsEditing(false)
  }

  const handleNameUA = (e) => {
    const v = e.target.value
    if (v.length <= 64) {
      setNewNameUA(v)
    }
  }

  const handleNameRU = (e) => {
    const v = e.target.value
    if (v.length <= 64) {
      setNewNameRU(v)
    }
  }

  const handleURL = (e) => {
    const v = e.target.value
    if (v.length <= 64) {
      setNewURL(v)
    }
  }

  const handleType = variant => setNewType(variant.type)

  const getURL = () => {
    if (type == 1) return "https://test.yva.com.ua/collections/" + url
    if (type == 2) return "https://test.yva.com.ua/accessories/" + url
  }

  const inputAdornment = () => {
    if (type == 1) return "https://test.yva.com.ua/collections/"
    if (type == 2) return "https://test.yva.com.ua/accessories/"
  }

  return (
    <Bubble>
      <Snackbar
        message={snackbarMessage}
        open={snackbarOpen}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
      {isEditing === true ? (
        <>
          <TextField
            variant="outlined"
            onChange={handleNameUA}
            defaultValue={nameUA}
            label={`Нова назва (UA): ${newNameUA.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
          />
          <TextField
            variant="outlined"
            onChange={handleNameRU}
            defaultValue={nameRU}
            label={`Нова назва (RU): ${newNameRU.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
          />
          <Autocomplete
            onChange={handleType}
            options={typeList}
            getOptionLabel={type => type.name}
            defaultValue={typeList[type - 1]}
            required
            variant="outlined"
          />
          <TextField
            variant="outlined"
            onChange={handleURL}
            defaultValue={url}
            label={`Нове посилання: ${newURL.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  {inputAdornment()}
                </InputAdornment>
              ),
            }}
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
                    setIsEditing(true)
                    setBlockAnchor(null)
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
              Назва (UA): <span>{nameUA}</span>
            </Typography>
            <Typography variant="button">
              Назва (RU): <span>{nameRU}</span>
            </Typography>
            <Typography variant="button">
              Посилання:{" "}
                <span className="aqua">{getURL()}</span>
            </Typography>
          </>
        )}
    </Bubble>
  )
}

export default GroupBlock