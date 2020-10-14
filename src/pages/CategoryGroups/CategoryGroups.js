import React, { useState, useEffect } from "react"
import axios from "axios"
import { connect } from "react-redux"

import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
} from "@material-ui/core"

import { MoreVert as MoreVertIcon } from "@material-ui/icons"

import Wrapper from "./../../ui/Wrapper"
import Bubble from "./../../ui/Bubble"
import Snackbar from "./../../ui/Snackbar"

import "./CategoryGroups.css"

const DialogSlider = ({ dialogPhotos }) => {
  const [curPhoto, setCurPhoto] = useState(0)

  return (
    <>
      {dialogPhotos.length !== 0 && (
        <>
          <div className="Products--photoslider--photos">
            <div
              style={{
                height: "350px",
                width: "400px",
                background: `url('${dialogPhotos[curPhoto].url}')`,
              }}
            />
          </div>
          <div className="Products--photoslider--indicator">
            {dialogPhotos.map((_, i) => {
              return (
                <div
                  key={i.toString()}
                  className={`Products--photoslider--dot${i === curPhoto ? " current" : ""
                    }`}
                  onClick={() => setCurPhoto(i)}
                ></div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

const GroupBlock = (props) => {
  const [nameUA, setNameUA] = useState(props.name_ua)
  const [nameRU, setNameRU] = useState(props.name_ru)
  const [url, setURL] = useState(props.url)

  const [newNameUA, setNewNameUA] = useState(props.name_ua)
  const [newNameRU, setNewNameRU] = useState(props.name_ru)
  const [newURL, setNewURL] = useState(props.url)

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

    setIsEditing(false)
  }

  const applyEdit = () => {
    if (
      (newNameUA !== nameUA && newNameUA.length !== 0) ||
      (newNameRU !== nameRU && newNameRU.length !== 0) ||
      (newURL !== url && newURL.length !== 0)
    ) {
      let updatedCategory = new FormData()

      updatedCategory.append("id", props.id)
      updatedCategory.append("nameUA", newNameUA)
      updatedCategory.append("nameRU", newNameRU)
      updatedCategory.append("url", newURL)

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
          <TextField
            variant="outlined"
            onChange={handleURL}
            defaultValue={url}
            label={`Нове посилання: ${newURL.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
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
              <span className="aqua">https://yva.com.ua/collection/{url}</span>
            </Typography>
          </>
        )}
    </Bubble>
  )
}

const CategoryGroups = (props) => {
  const { isLoggedIn } = props

  const [groups, setGroups] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogPhotos, setDialogPhotos] = useState([])
  const [dialogSection, setDialogSection] = useState(0)

  const [nameUA, setNameUA] = useState("")
  const [nameRU, setNameRU] = useState("")
  const [url, setURL] = useState("")

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const closeSnackbar = () => setSnackbarOpen(false)

  useEffect(() => {
    if (isLoggedIn) {
      axios("/admin/category_groups/").then((res) => {
        setGroups(res.data)
      })
    }
  }, [isLoggedIn])

  const closeDialog = () => {
    setNameUA("")
    setNameRU("")
    setURL("")
    setOpenDialog(false)
  }

  const addGroup = () => {
    const group = new FormData()

    group.append("nameUA", nameUA)
    group.append("nameRU", nameRU)
    group.append("url", url)
    group.append("wallpaper", dialogPhotos[0].file)

    axios
      .post("/admin/category_groups/create/", group)
      .then((res) => {
        setSnackbarSeverity("success")
        setSnackbarMessage("Колекція успішно створена")
        setSnackbarOpen(true)

        console.log("POST_CATEGORY_GROUP: ", res.data)
        setGroups((c) => c.concat(res.data))
      })
      .catch((err) => {
        setSnackbarSeverity("success")
        setSnackbarMessage("Не вдалося створити колекцію")
        setSnackbarOpen(true)

        console.log("POST_CATEGORY_GROUP_ERR: ", err)
      })
      .finally(closeDialog())
  }

  const deleteGroup = (id) => {
    const data = new FormData()

    data.append("id", id)

    axios
      .post("/admin/category_groups/delete/", data)
      .then((res) => {
        setSnackbarSeverity("success")
        setSnackbarMessage("Колекція успішно видалена")
        setSnackbarOpen(true)

        setGroups(groups.filter((group) => group.id !== id))
      })
      .catch((err) => {
        setSnackbarSeverity("error")
        setSnackbarMessage("Не вдалося видалити колекцію")
        setSnackbarOpen(true)
      })
  }

  const handleNameUA = (e) => {
    setNameUA(e.target.value)
  }
  const handleNameRU = (e) => {
    setNameRU(e.target.value)
  }
  const handleURL = (e) => {
    setURL(e.target.value)
  }

  const dialogPhotosChange = (e) => {
    let files = []

    for (let i = 0; i < e.currentTarget.files.length; i++) {
      let f = e.currentTarget.files[i]
      let url = URL.createObjectURL(f)

      files.push({ url: url, file: f })
    }

    setDialogPhotos((f) => f.concat(...files))
  }

  const isValid = nameUA !== "" && nameRU !== "" && url !== ""

  const dialog = (
    <Dialog onClose={closeDialog} open={openDialog} fullWidth>
      <DialogTitle>Нова колекція</DialogTitle>
      <DialogContent>
        {dialogSection === 0 && <>
          <TextField
            onChange={handleNameUA}
            label={`Назва (UA) : ${nameUA.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
            fullWidth
            autoFocus
            required
          />
          <TextField
            onChange={handleNameRU}
            label={`Назва (RU) : ${nameRU.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
            fullWidth
            required
          />
          <TextField
            onChange={handleURL}
            label={`Посилання : ${url.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  https://test.yva.com.ua/collections/
                </InputAdornment>
              ),
            }}
          />
        </>}
        {dialogSection === 1 && (
          <>
            <input
              type="file"
              onChange={(e) => dialogPhotosChange(e)}
              id="p-file"
              accept="image/*"
              style={{ display: "none" }}
            />
            <div className="Products--photoslider">
              <DialogSlider dialogPhotos={dialogPhotos} />
              {dialogPhotos.length === 0 && (
                <Button variant="contained" color="primary" disableElevation>
                  <label htmlFor="p-file">Вибрати фото</label>
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={closeDialog}>
          Відміна
        </Button>
        {dialogSection === 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialogSection(1)}
            disableElevation
            disabled={!isValid}
          >
            Вибрати фотографію
          </Button>
        )}
        {dialogSection === 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={addGroup}
            disableElevation
            disabled={!isValid}
          >
            Добавити
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )

  return (
    <Wrapper>
      {openDialog && dialog}
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
      <div className="ActionBar">
        <div className="ActionBar--title">Колекції</div>
        <Button
          onClick={() => setOpenDialog(true)}
          color="primary"
          variant="contained"
          disableElevation
        >
          Нова колекція
        </Button>
      </div>
      <div className="CategoryGroups Shell">
        {groups.length === 0 && (
          <Typography variant="h5" className="NoData">
            Не існує жодної колекції
          </Typography>
        )}
        {groups.map((group, index) => {
          return (
            <GroupBlock
              {...group}
              delete={() => deleteGroup(group.id)}
              key={group.id}
              index={index}
            />
          )
        })}
      </div>
    </Wrapper>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authReducer.isLoggedIn,
  }
}

export default connect(mapStateToProps)(CategoryGroups)
