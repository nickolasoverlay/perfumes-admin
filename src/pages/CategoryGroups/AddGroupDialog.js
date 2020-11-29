import React, { useState } from "react"

import axios from "axios"

import {
  Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, TextField, Button,
} from "@material-ui/core"

import Autocomplete from "../../ui/AutoComplete"

export const typeList = [
  {
    type: 1,
    name: "Показувати в колекціях",
  },
  {
    type: 2,
    name: "Показувати в аксесуарах"
  }
]

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

const AddGroupDialog = ({ closeDialog, setGroups }) => {
  const [nameUA, setNameUA] = useState("")
  const [nameRU, setNameRU] = useState("")
  const [type, setType] = useState(1)
  const [url, setURL] = useState("")

  const [dialogPhotos, setDialogPhotos] = useState([])
  const [dialogSection, setDialogSection] = useState(0)

  const [snackBarMessage, setSnackbarMessage] = useState("")
  const [snackBarSeverity, setSnackbarSeverity] = useState("")
  const [snackBarOpen, setSnackbarOpen] = useState(false)

  const handleNameUA = e => setNameUA(e.target.value)
  const handleNameRU = e => setNameRU(e.target.value)
  const handleURL = e => setURL(e.target.value)

  const handleType = variant => setType(variant.type)

  const inputAdornment = () => {
    if (type == 1) return "https://test.yva.com.ua/collections/"
    if (type == 2) return "https://test.yva.com.ua/accessories/"
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

  const addGroup = () => {
    const group = new FormData()

    group.append("nameUA", nameUA)
    group.append("nameRU", nameRU)
    group.append("url", url)
    group.append("type", type)
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

  const isValid = nameUA !== "" && nameRU !== "" && url !== ""

  return (
    <Dialog onClose={closeDialog} open={true} fullWidth>
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
          <Autocomplete
            onChange={handleType}
            options={typeList}
            getOptionLabel={type => type.name}
            defaultValue={typeList[0]}
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
                  {inputAdornment()}
                </InputAdornment>
              ),
            }}
          />
        </>
        }
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
}

export default AddGroupDialog