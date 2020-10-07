import React, { useState } from "react"
import axios from "axios"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  InputAdornment,
  IconButton,
  Typography,
  Button,
  TextField
} from "@material-ui/core"

import { MoreVertOutlined as MoreVert } from "@material-ui/icons"

import Snackbar from "./../../ui/Snackbar"
import Menu from "./../../ui/Menu"

const Slide = ({ slide, isActive, editOpen, closeEdit }) => {
  const [textUA, setTextUA] = useState(slide.text_ua)
  const [textRU, setTextRU] = useState(slide.text_ru)
  const [url, setURL] = useState(slide.url)

  const [newTextUA, setNewTextUA] = useState(slide.text_ua)
  const [newTextRU, setNewTextRU] = useState(slide.text_ru)
  const [newURL, setNewURL] = useState(slide.url)

  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarText, setSnackBarText] = useState("")
  const [snackBarSeverity, setSnackBarSeverity] = useState("success")

  const handleEditClose = () => {
    setNewTextUA(slide.text_ua)
    setNewTextRU(slide.text_ru)
    setNewURL(slide.url)

    closeEdit()
  }

  const handleSubmit = () => {
    const data = new FormData()

    data.append("id", slide.id)
    data.append("textUA", newTextUA)
    data.append("textRU", newTextRU)
    data.append("url", newURL)

    axios
      .post(`${process.env.REACT_APP_API}/admin/home_slider/update/`, data, {
        withCredentials: true
      })
      .then(res => {
        console.log("SLIDE_UPDATE_RESPONSE: ", res.data)

        setTextUA(newTextUA)
        setTextRU(newTextRU)
        setURL(newURL)

        setSnackBarSeverity("success")
        setSnackBarText("Зміни успішно збережені")
      })
      .catch(err => {
        setSnackBarSeverity("error")
        setSnackBarText("Не вдалося зберегти зміни")
      })
      .finally(() => {
        setSnackBarOpen(true)
        handleEditClose()
      })
  }

  const editDialog = (
    <Dialog open={editOpen} onClose={handleEditClose} fullWidth>
      <DialogTitle>Редагування слайду #{slide.id}</DialogTitle>
      <DialogContent>
        <TextField
          defaultValue={textUA}
          label={`Текст (UA): ${newTextUA.length} / 64`}
          onChange={e => setNewTextUA(e.target.value)}
          fullWidth
        />
        <TextField
          defaultValue={textRU}
          label={`Текст (RU): ${newTextRU.length} / 64`}
          onChange={e => setNewTextRU(e.target.value)}
          fullWidth
        />
        <TextField
          defaultValue={url}
          label={`URL: ${newURL.length} / 64`}
          onChange={e => setNewURL(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment>
                https://test.yva.com.ua/collections/
              </InputAdornment>
            )
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="primary" onClick={handleEditClose}>
          Відміна
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleSubmit}
        >
          Зберегти зміни
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <div className="HomeSliderPreview--slide">
      {editDialog}

      <Snackbar
        severity={snackBarSeverity}
        message={snackBarText}
        open={snackBarOpen}
        onClose={() => setSnackBarOpen(false)}
      />

      <div
        className="HomeSliderPreview--item"
        style={{
          height: 400,
          display: isActive ? "block" : "none",
          width: "100%",
          background: `url('${process.env.REACT_APP_API}/media/${slide.picture}')`
        }}
      ></div>
    </div>
  )
}

const HomeSliderPreview = props => {
  const { onDelete, slides } = props

  const [curPhoto, setCurPhoto] = useState(0)
  const [menuAnchor, setMenuAnchor] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)

  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarText, setSnackBarText] = useState("")
  const [snackBarSeverity, setSnackBarSeverity] = useState("success")

  // Indicate that we are edit slide at current index
  const [editingSlide, setEditingSlide] = useState(false)

  const handleDeleteClose = () => {
    setCurPhoto(0)
    setDeleteOpen(false)
    setMenuAnchor(null)
  }

  const handleDelete = () => {
    const data = new FormData()
    data.append("id", slides[curPhoto].id)

    axios
      .post(`${process.env.REACT_APP_API}/admin/home_slider/delete/`, data, {
        withCredentials: true
      })
      .then(res => {
        console.log("[HOME_SLIDER_DELETE]: ", res.data)
        onDelete(slides[curPhoto].id)

        setSnackBarSeverity("success")
        setSnackBarText("Категорія успішно видалена")
      })
      .catch(err => {
        console.log("[HOME_SLIDER_DELETE_ERROR]: ", err)

        setSnackBarSeverity("error")
        setSnackBarText("Не вдалося видалити категорію")
      })
      .finally(() => {
        handleDeleteClose()
        setSnackBarOpen(true)
      })
  }

  const deleteDialog = (
    <Dialog open={deleteOpen} onClose={handleDeleteClose} fullWidth>
      <DialogTitle>Підвердіть видалення слайду</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ви дійсно бажаєте видалити слайд #{curPhoto + 1}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="primary" onClick={handleDeleteClose}>
          Ні
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDelete}
          disableElevation
        >
          Так
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <div className="HomeSliderPreview">
      {deleteDialog}
      <Snackbar
        severity={snackBarSeverity}
        message={snackBarText}
        open={snackBarOpen}
        onClose={() => setSnackBarOpen(false)}
      />

      {slides.length !== 0 && (
        <IconButton
          onClick={e => setMenuAnchor(e.target)}
          style={{
            float: "right"
          }}
        >
          <MoreVert />
        </IconButton>
      )}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setDeleteOpen(true)}>Видалити слайд</MenuItem>
        <MenuItem
          onClick={() => {
            setEditingSlide(true)
            setMenuAnchor(null)
          }}
        >
          Редагувати слайд
        </MenuItem>
      </Menu>
      {slides.length === 0 && (
        <Typography variant="h5" className="NoData">
          Не має жодної пропозиції
        </Typography>
      )}
      <div className="HomeSliderPreview--slides">
        {slides.map((slide, idx) => {
          return (
            <Slide
              slide={slide}
              isActive={idx === curPhoto}
              editOpen={editingSlide && idx === curPhoto}
              closeEdit={() => setEditingSlide(false)}
              key={slide.id}
            />
          )
        })}
      </div>
      <div className="HomeSliderPreview--dots">
        {slides.map((_, i) => {
          return (
            <div
              key={i.toString()}
              className={`Products--photoslider--dot${
                i === curPhoto ? " current" : ""
              }`}
              onClick={() => setCurPhoto(i)}
            ></div>
          )
        })}
      </div>
    </div>
  )
}

export default HomeSliderPreview
