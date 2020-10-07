import React, { useState, useEffect } from "react"
import axios from "axios"
import { connect } from "react-redux"
import Wrapper from "./../../ui/Wrapper"
import AutoComplete from "./../../ui/AutoComplete"
import Menu from "./../../ui/Menu"
import Snackbar from "./../../ui/Snackbar"
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Badge,
  MenuItem
} from "@material-ui/core"

import ProductBlock from "./ProductBlock"
import ProductsSlider from "./ProductsSlider"

import "./Products.css"

const Products = props => {
  const { isLoggedIn } = props

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState([])

  const [categoryIndex, setCategoryIndex] = useState(0) // Index of category
  const [categoryAnchor, setCategoryAnchor] = useState(null)

  // Dialog state - different sections for photos and text info
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogState, setDialogState] = useState(0)
  const [dialogPhotos, setDialogPhotos] = useState([])

  useEffect(() => {
    if (isLoggedIn) {
      axios(`${process.env.REACT_APP_API}/admin/products/`, {
        withCredentials: true
      })
        .then(res => {
          setProducts(res.data.products)
          setCategories(res.data.categories)
          setFilters(res.data.filters)
        })
        .catch(err => {})
    }
  }, [isLoggedIn])

  // Category params
  const [category, setCategory] = useState(0)
  const [nameUA, setNameUA] = useState("")
  const [nameRU, setNameRU] = useState("")
  const [shortUA, setShortUA] = useState("")
  const [shortRU, setShortRU] = useState("")
  const [descriptionUA, setDescriptionUA] = useState("")
  const [descriptionRU, setDescriptionRU] = useState("")
  const [instructionUA, setInstructionUA] = useState("")
  const [instructionRU, setInstructionRU] = useState("")
  const [componentsUA, setComponentsUA] = useState("")
  const [componentsRU, setComponentsRU] = useState("")
  const [price, setPrice] = useState(0)
  const [size, setSize] = useState(0)
  const [filter, setFilter] = useState(0) // ID of filter

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const closeSnackbar = () => setSnackbarOpen(false)

  const closeDialog = () => {
    setDialogPhotos([])
    setDialogState(0)
    setNameUA("")
    setNameRU("")
    setShortUA("")
    setShortRU("")
    setDescriptionUA("")
    setDescriptionRU("")
    setInstructionUA("")
    setInstructionRU("")
    setComponentsUA("")
    setComponentsRU("")
    setPrice(0)
    setSize(0)
    setFilter(0)
    setOpenDialog(false)
  }

  const dialogPhotosChange = e => {
    let files = []

    for (let i = 0; i < e.currentTarget.files.length; i++) {
      let f = e.currentTarget.files[i]
      let url = URL.createObjectURL(f)

      files.push({ url: url, file: f })
    }

    setDialogPhotos(f => f.concat(...files))
  }

  const addProduct = () => {
    const product = new FormData()

    product.append("category", category)
    product.append("nameUA", nameUA)
    product.append("nameRU", nameRU)
    product.append("shortUA", shortUA)
    product.append("shortRU", shortRU)
    product.append("descriptionUA", descriptionUA)
    product.append("descriptionRU", descriptionRU)
    product.append("instructionUA", instructionUA)
    product.append("instructionRU", instructionRU)
    product.append("componentsUA", componentsUA)
    product.append("componentsRU", componentsRU)
    product.append("price", price)
    product.append("size", size)
    product.append("isAvailable", false)
    product.append("quantityAvailable", 0)
    product.append("filter", filter)

    product.append("photosQuantity", dialogPhotos.length)
    dialogPhotos.forEach((photo, index) => {
      product.append("photo_" + index, photo.file)
    })

    axios
      .post(`${process.env.REACT_APP_API}/admin/products/create/`, product, {
        withCredentials: true
      })
      .then(res => {
        setSnackbarSeverity("success")
        setSnackbarMessage("Товар успішно створено")
        setSnackbarOpen(true)

        setProducts(p => p.concat(res.data))
      })
      .catch(err => {
        setSnackbarSeverity("error")
        setSnackbarMessage("Не вдалося створити новий товар")
        setSnackbarOpen(true)
      })
      .finally(closeDialog())
  }

  const deleteProduct = id => {
    const data = new FormData()

    data.append("id", id)

    axios
      .post(`${process.env.REACT_APP_API}/admin/products/delete/`, data, {
        withCredentials: true
      })
      .then(res => {
        setSnackbarSeverity("success")
        setSnackbarMessage("Товар успішно видалено")
        setSnackbarOpen(true)

        setProducts(products.filter(p => p.id !== id))
      })
      .catch(err => {
        setSnackbarSeverity("error")
        setSnackbarMessage("Не вдалося видалити товар")
        setSnackbarOpen(true)
      })
  }

  const isValid =
    category !== 0 &&
    nameUA !== "" &&
    nameRU !== "" &&
    shortUA !== "" &&
    shortRU !== "" &&
    descriptionUA !== "" &&
    descriptionRU !== "" &&
    instructionUA !== "" &&
    instructionRU !== "" &&
    price !== 0 &&
    size !== 0

  const dialog = (
    <Dialog onClose={closeDialog} open={openDialog} fullWidth>
      <DialogTitle>Новий товар</DialogTitle>
      {dialogState === 0 && (
        <DialogContent>
          <TextField
            onChange={e => setNameUA(e.target.value)}
            label={`Назва (UA): ${nameUA.length} / 64`}
            margin="dense"
            fullWidth
            autoFocus
            required
            inputProps={{ maxLength: 64 }}
          />
          <TextField
            onChange={e => setNameRU(e.target.value)}
            label={`Назва (RU): ${nameRU.length} / 64`}
            margin="dense"
            fullWidth
            required
            inputProps={{ maxLength: 64 }}
          />
          <AutoComplete
            onChange={category => setCategory(category.id)}
            label="Категорія"
            options={categories}
            getOptionLabel={category => category.name_ua}
          />
          <AutoComplete
            onChange={filter => setFilter(filter.id)}
            label="Фільтр (опціонально)"
            options={filters.filter(filter => filter.category === category)}
            getOptionLabel={filter => filter.name_ua}
          />
          <TextField
            onChange={e => setShortUA(e.target.value)}
            label={`Підзаголовок (UA): ${shortUA.length} / 128`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 128 }}
          />
          <TextField
            onChange={e => setShortRU(e.target.value)}
            label={`Підзаголовок (RU): ${shortRU.length} / 128`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 128 }}
          />
          <TextField
            onChange={e => setDescriptionUA(e.target.value)}
            label={`Опис (UA): ${descriptionUA.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={e => setDescriptionRU(e.target.value)}
            label={`Опис (RU): ${descriptionRU.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={e => setInstructionUA(e.target.value)}
            label={`Інструкція (UA) ${instructionUA.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={e => setInstructionRU(e.target.value)}
            label={`Інструкція (RU): ${instructionRU.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={e => setComponentsUA(e.target.value)}
            label={`Склад (UA): ${componentsUA.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={e => setComponentsRU(e.target.value)}
            label={`Склад (RU): ${componentsRU.length} / 1024`}
            margin="dense"
            fullWidth
            required
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            onChange={e => setPrice(e.target.value)}
            label="Ціна"
            margin="dense"
            fullWidth
            required
            type="number"
          />
          <TextField
            onChange={e => setSize(e.target.value)}
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
            onChange={e => dialogPhotosChange(e)}
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
            onClick={() => setDialogState(1)}
            variant="contained"
            disableElevation
            disabled={!isValid}
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

  /**
   * Returns number of products in category at provided index
   * @param {Number} ctIndex
   */
  const productsInCategory = ctIndex => {
    const q = products.filter(
      product => product.category === categories[ctIndex].id
    ).length
    return q
  }

  return (
    <Wrapper>
      {openDialog && dialog}
      <Snackbar
        message={snackbarMessage}
        open={snackbarOpen}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
      <div className="ActionBar ProductsActionBar">
        <div className="ActionBar--title">Товари</div>
        <div>
          {categories && categories.length !== 0 && (
            <>
              <Button
                onClick={e => setCategoryAnchor(e.target)}
                color="primary"
                variant="contained"
                disableElevation
              >
                Категорія: {categories[categoryIndex].name_ua}
                <Badge
                  color="secondary"
                  badgeContent={productsInCategory(categoryIndex)}
                ></Badge>
              </Button>
              <Menu
                anchorEl={categoryAnchor}
                open={Boolean(categoryAnchor)}
                onClose={() => setCategoryAnchor(null)}
              >
                {categories.map((category, index) => {
                  return (
                    <MenuItem
                      key={category.id}
                      onClick={() => {
                        setCategoryIndex(index)
                        setCategoryAnchor(null)
                      }}
                    >
                      {category.name_ua}
                      <Badge
                        color="secondary"
                        badgeContent={productsInCategory(index)}
                      ></Badge>
                    </MenuItem>
                  )
                })}
              </Menu>
            </>
          )}
          <Button
            style={{ marginLeft: "15px" }}
            onClick={() => setOpenDialog(true)}
            color="primary"
            variant="contained"
            disableElevation
          >
            Добавити товар
          </Button>
        </div>
      </div>
      <div className="Products Shell">
        {categories.length === 0 && (
          <Typography variant="h5" className="NoData">
            Для добавлення товару необхідно добавити хоча б одну категорію
          </Typography>
        )}
        {categories &&
          categories.length !== 0 &&
          products.filter(
            product => product.category === categories[categoryIndex].id
          ).length === 0 && (
            <Typography variant="h5" className="NoData">
              В цій категорії немає жодного товару
            </Typography>
          )}
        {categories &&
          categories.length !== 0 &&
          products
            .filter(
              product => product.category === categories[categoryIndex].id
            )
            .map(product => {
              return (
                <ProductBlock
                  key={product.id}
                  delete={() => deleteProduct(product.id)}
                  {...product}
                  categories={categories}
                  filters={filters}
                />
              )
            })}
      </div>
    </Wrapper>
  )
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.authReducer.isLoggedIn
  }
}

export default connect(mapStateToProps)(Products)
