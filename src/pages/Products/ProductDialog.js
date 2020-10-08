import React, { useState } from "react"
import ProductsSlider from "./ProductsSlider"

import AutoComplete from "./../../ui/AutoComplete"
import Menu from "./../../ui/Menu"

import axios from "axios"

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Badge,
  MenuItem,
} from "@material-ui/core"

const ProductDialog = (props) => {
  const {
    closeDialog,
    openDialog,
    filters,
    categories,
    onSuccess,
    onError,
  } = props

  const product = {
    category: 0,
    filter: 0,
    nameUA: "",
    nameRU: "",
    shortUA: "",
    shortRU: "",
    descriptionUA: "",
    descriptionRU: "",
    instructionUA: "",
    instructionRU: "",
    componentsUA: "",
    componentsRU: "",
    price: 0,
    size: 0,
    isAvailable: false,
    quantityAvailable: 0,
  }

  const [finalProduct, setFinalProduct] = useState({})

  const [dialogState, setDialogState] = useState(0)
  const [dialogPhotos, setDialogPhotos] = useState([])

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const closeSnackbar = () => setSnackbarOpen(false)

  /**
   *
   * @param {String} field
   * @param {Event} event
   * @param {String | Number} value
   */
  const util = (field, event, value) => {
    if (event) {
      product[field] = event.target.value
    } else {
      product[field] = value
    }
  }

  const dialogPhotosChange = (e) => {
    const files = []

    for (let i = 0; i < e.currentTarget.files.length; i++) {
      let f = e.currentTarget.files[i]
      let url = URL.createObjectURL(f)

      files.push({ url: url, file: f })
    }

    setDialogPhotos((f) => f.concat(...files))
  }

  const addProduct = () => {
    const p = new FormData()
    Object.keys(finalProduct).forEach((k) => {
      p.append(k, finalProduct[k])
    })

    p.append("photosQuantity", dialogPhotos.length)
    dialogPhotos.forEach((photo, index) => {
      p.append("photo_" + index, photo.file)
    })

    axios
      .post("/admin/products/create/", p)
      .then((res) => {
        onSuccess(res.data)
      })
      .catch((err) => {
        onError()
      })
      .finally(closeDialog())
  }

  const switchState = () => {
    setFinalProduct(product)
    setDialogState(1)
  }

  return (
    <Dialog onClose={closeDialog} open={openDialog} fullWidth>
      <DialogTitle>Новий товар</DialogTitle>
      {dialogState === 0 && (
        <DialogContent>
          <TextField
            onChange={(e) => util("nameUA", e)}
            label={`Назва (UA): ${product.nameUA.length} / 64`}
            margin="dense"
            fullWidth
            autoFocus
            required
            inputProps={{ maxLength: 64 }}
          />
          <TextField
            onChange={(e) => util("nameRU", e)}
            label={`Назва (RU): ${product.nameRU.length} / 64`}
            margin="dense"
            fullWidth
            required
            inputProps={{ maxLength: 64 }}
          />
          <AutoComplete
            onChange={(category) => util("category", null, category.id)}
            label="Категорія"
            options={categories}
            getOptionLabel={(category) => category.name_ua}
          />
          <AutoComplete
            onChange={(filter) => util("filter", null, filter.id)}
            label="Фільтр (опціонально)"
            options={filters.filter(
              (filter) => filter.category === product.category
            )}
            getOptionLabel={(filter) => filter.name_ua}
          />
          <TextField
            onChange={(e) => util("shortUA", e)}
            label={`Підзаголовок (UA): ${product.shortUA.length} / 128`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 128 }}
          />
          <TextField
            onChange={(e) => util("shortRU", e)}
            label={`Підзаголовок (RU): ${product.shortRU.length} / 128`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 128 }}
          />
          <TextField
            onChange={(e) => util("descriptionUA", e)}
            label={`Опис (UA): ${product.descriptionUA.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={(e) => util("descriptionRU", e)}
            label={`Опис (RU): ${product.descriptionRU.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={(e) => util("instructionUA", e)}
            label={`Інструкція (UA) ${product.instructionUA.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={(e) => util("instructionRU", e)}
            label={`Інструкція (RU): ${product.instructionRU.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={(e) => util("componentsUA", e)}
            label={`Склад (UA): ${product.componentsUA.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={(e) => util("componentsRU", e)}
            label={`Склад (RU): ${product.componentsRU.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={(e) => util("price", e)}
            label="Ціна"
            margin="dense"
            fullWidth
            required
            type="number"
          />
          <TextField
            onChange={(e) => util("size", e)}
            label="Розмір/Об'єм"
            margin="dense"
            fullWidth
            required
            type="number"
          />
        </DialogContent>
      )}
      {dialogState === 1 && (
        <DialogContent>
          <input
            type="file"
            multiple
            onChange={(e) => dialogPhotosChange(e)}
            id="p-file"
            accept="image/*"
            style={{ display: "none" }}
          />
          <div className="Products--photoslider">
            <ProductsSlider
              dialogPhotos={dialogPhotos}
              setDialogPhotos={setDialogPhotos}
              dialogPhotosChange={dialogPhotosChange}
            />
            {dialogPhotos.length === 0 && (
              <Button variant="contained" color="primary" disableElevation>
                <label htmlFor="p-file">Вибрати фото</label>
              </Button>
            )}
          </div>
        </DialogContent>
      )}
      <DialogActions>
        <Button color="primary" onClick={closeDialog}>
          Відміна
        </Button>
        {dialogState === 0 && (
          <Button
            color="primary"
            onClick={switchState}
            variant="contained"
            disableElevation
            disabled={false}
          >
            Вибір фото
          </Button>
        )}
        {dialogState === 1 && (
          <Button
            color="primary"
            onClick={addProduct}
            variant="contained"
            disableElevation
            disabled={dialogPhotos.length === 0}
          >
            Добавити
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ProductDialog
