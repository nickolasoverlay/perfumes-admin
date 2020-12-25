import React, { useState } from "react"

import {
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Button,
} from "@material-ui/core"

import {
  ExpandMore,
  ExpandLess,
  MoreVertOutlined as MoreVert,
} from "@material-ui/icons"

import Bubble from "./../../ui/Bubble"
import Snackbar from "./../../ui/Snackbar"
import AutoComplete from "./../../ui/AutoComplete"

import ProductSlider from "./ProductsSlider"
import axios from "axios"

const ProductBlock = (props) => {
  // Use those variables to override state locally
  const [nameUA, setNameUA] = useState(props.name_ua)
  const [nameRU, setNameRU] = useState(props.name_ru)
  const [category, setCategory] = useState(props.category)
  const [filter, setFilter] = useState(props.filter)
  const [shortUA, setShortUA] = useState(props.short_ua)
  const [shortRU, setShortRU] = useState(props.short_ru)
  const [descriptionUA, setDescriptionUA] = useState(props.description_ua)
  const [descriptionRU, setDescriptionRU] = useState(props.description_ru)
  const [instructionUA, setInstructionUA] = useState(props.instruction_ua)
  const [instructionRU, setInstructionRU] = useState(props.instruction_ru)
  const [componentsUA, setComponentsUA] = useState(props.components_ua)
  const [componentsRU, setComponentsRU] = useState(props.components_ru)
  const [price, setPrice] = useState(props.price)
  const [updatedPrice, setUpdatedPrice] = useState(props.new_price)
  // const [quantityAvailable, setQuantityAvailable] = useState(quantity_available)
  const [size, setSize] = useState(props.size)
  const [additionalSize, setAdditionalSize] = useState(props.additional_size)
  const [isAvailable, setIsAvailable] = useState(props.is_available)
  const [withAction, setWithAction] = useState(props.with_action)
  // split to ease handling
  const [photos, setPhotos] = useState(props.picture.split(","))

  const [newNameUA, setNewNameUA] = useState(props.name_ua)
  const [newNameRU, setNewNameRU] = useState(props.name_ru)
  const [newCategory, setNewCategory] = useState(props.category)
  const [newFilter, setNewFilter] = useState(props.filter)
  const [newShortUA, setNewShortUA] = useState(props.short_ua)
  const [newShortRU, setNewShortRU] = useState(props.short_ru)
  const [newDescriptionUA, setNewDescriptionUA] = useState(props.description_ua)
  const [newDescriptionRU, setNewDescriptionRU] = useState(props.description_ru)
  const [newInstructionUA, setNewInstructionUA] = useState(props.instruction_ua)
  const [newInstructionRU, setNewInstructionRU] = useState(props.instruction_ru)
  const [newComponentsUA, setNewComponentsUA] = useState(props.components_ua)
  const [newComponentsRU, setNewComponentsRU] = useState(props.components_ru)
  const [newPrice, setNewPrice] = useState(props.price)
  const [newUpdatedPrice, setNewUpdatedPrice] = useState(props.new_price)

  // const [newQuantityAvailable, setNewQuantityAvailable] = useState("")
  const [newSize, setNewSize] = useState(props.size)
  const [newAdditionalSize, setNewAdditionalSize] = useState(
    props.additional_size
  )

  // Define card view
  const VIEW_DEFAULT = 0
  const VIEW_EXPANDED = 1
  const VIEW_EDITING = 2
  const VIEW_IMAGES = 3

  const [viewMode, setViewMode] = useState(0)
  const [blockAnchor, setBlockAnchor] = useState(null)

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const closeSnackbar = () => setSnackbarOpen(false)

  const compString = (n, m) => {
    const is = n !== m && m.length !== 0

    console.log(is)

    return is
  }

  const compNum = (n, m, name) => {
    const is = n !== m
    console.log(is, "[n,m]: ", name, n, m)

    return is
  }

  const hasFieldChanged = () => {
    return (
      compString(nameUA, newNameUA) ||
      compString(nameRU, newNameRU) ||
      compNum(category, newCategory, "category_id") ||
      compNum(filter, newFilter, "filter_id") ||
      compString(shortUA, newShortUA) ||
      compString(shortRU, newShortRU) ||
      compString(descriptionUA, newDescriptionUA) ||
      compString(descriptionRU, newDescriptionRU) ||
      compString(instructionUA, newInstructionUA) ||
      compString(instructionRU, newInstructionRU) ||
      compString(componentsUA, newComponentsUA) ||
      compString(componentsRU, newComponentsRU) ||
      compNum(price, newPrice, "price") ||
      compNum(updatedPrice, newUpdatedPrice, "updated_price") ||
      compNum(size, newSize, "size") ||
      compNum(additionalSize, newAdditionalSize, "additional_size")
    )
  }

  const applyEdit = () => {
    if (hasFieldChanged()) {
      const updatedProduct = new FormData()

      updatedProduct.append("id", props.id)
      updatedProduct.append("category", newCategory)
      updatedProduct.append("filter", newFilter)
      updatedProduct.append("nameUA", newNameUA)
      updatedProduct.append("nameRU", newNameRU)
      updatedProduct.append("shortUA", newShortUA)
      updatedProduct.append("shortRU", newShortRU)
      updatedProduct.append("descriptionUA", newDescriptionUA)
      updatedProduct.append("descriptionRU", newDescriptionRU)
      updatedProduct.append("instructionUA", newInstructionUA)
      updatedProduct.append("instructionRU", newInstructionRU)
      updatedProduct.append("componentsUA", newComponentsUA)
      updatedProduct.append("componentsRU", newComponentsRU)
      updatedProduct.append("price", newPrice)
      updatedProduct.append("new_price", newUpdatedPrice)
      updatedProduct.append("size", newSize)
      updatedProduct.append("additionalSize", newAdditionalSize)

      axios
        .post("/admin/products/update/", updatedProduct)
        .then((res) => {
          setSnackbarMessage("Продукт успішно оновлено")
          setSnackbarSeverity("success")
          setSnackbarOpen(true)

          if (newNameUA !== "") {
            setNameUA(newNameUA)
          }
          if (newNameRU !== "") {
            setNameRU(newNameRU)
          }
          setCategory(newCategory)
          setFilter(newFilter)
          if (newShortUA !== "") {
            setShortUA(newShortUA)
          }
          if (newShortRU !== "") {
            setShortRU(newShortRU)
          }
          if (newDescriptionUA !== "") {
            setDescriptionUA(newDescriptionUA)
          }
          if (newDescriptionRU !== "") {
            setDescriptionRU(newDescriptionRU)
          }
          if (newInstructionUA !== "") {
            setInstructionUA(newInstructionUA)
          }
          if (newInstructionRU !== "") {
            setInstructionRU(newInstructionRU)
          }
          if (newComponentsUA !== "") {
            setComponentsUA(newComponentsUA)
          }
          if (newComponentsRU !== "") {
            setComponentsRU(newComponentsRU)
          }
          if (newPrice !== 0) {
            setPrice(newPrice)
          }
          if (newSize !== 0) {
            setSize(newSize)
          }
          if (newAdditionalSize !== 0) {
            setAdditionalSize(newAdditionalSize)
          }
          if (newUpdatedPrice !== 0) {
            setUpdatedPrice(newUpdatedPrice)
          }
          setViewMode(VIEW_DEFAULT)
        })
        .catch((err) => {
          setSnackbarMessage("Не вдалося оновити продукт")
          setSnackbarSeverity("error")
          setSnackbarOpen(true)

          console.log("UPDATE_CATEGORY_ERR: ", err)
        })
        .finally(setViewMode(VIEW_DEFAULT))
    }
  }

  const categoryLabel = () => {
    const c = props.categories.find((c) => c.id === category)

    if (c) {
      return c.name_ua
    }

    return "КАТЕГОРІЯ НЕ ПРИСВОЄНА"
  }

  const filterLabel = () => {
    const f = props.filters.find((f) => f.id === filter)

    if (f) {
      const c = props.categories.find((c) => c.id === f.category)
      return `[${c.name_ua}] ${f.name_ua}`
    }

    return "ФІЛЬТР НЕ ПРИСВОЄНИЙ"
  }

  const filterOptionLabel = (filter) => {
    if (filter) {
      const c = props.categories.find((c) => c.id === filter.category)
      return `[${c.name_ua}] ${filter.name_ua} / [${c.name_ru}] ${filter.name_ru}`
    }

    return ""
  }

  const categoryOptionLabel = (category) => {
    if (category) {
      return category.name_ua + "/" + category.name_ru
    }

    return ""
  }

  const changeAvailability = () => {
    const data = new FormData()

    data.append("id", props.id)
    data.append("is_available", !isAvailable)

    axios
      .post("/admin/products/update/", data)
      .then((res) => {
        setSnackbarMessage("Статус доступності успішно змінено")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
        setIsAvailable(!isAvailable)
      })
      .catch((err) => {
        setSnackbarMessage("Не вдалось змінити статус доступності")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      })
  }

  const changeWithAction = () => {
    const data = new FormData()

    data.append("id", props.id)
    data.append("withAction", !withAction)

    axios
      .post("/admin/products/update/", data)
      .then((res) => {
        setSnackbarMessage("Акційний статус змінено")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
        setWithAction(!withAction)
      })
      .catch((err) => {
        setSnackbarMessage("Не вдалось змінити акційний статус")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      })
  }

  return (
    <Bubble className={viewMode === VIEW_IMAGES ? "Bubble wide" : "Bubble"}>
      <Snackbar
        message={snackbarMessage}
        open={snackbarOpen}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
      <div className="Bubble--menu">
        <IconButton onClick={(e) => setBlockAnchor(e.currentTarget)}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={blockAnchor}
          open={Boolean(blockAnchor)}
          onClose={() => setBlockAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setViewMode(VIEW_DEFAULT)
              setBlockAnchor(null)
            }}
          >
            Згорнути
          </MenuItem>
          <MenuItem
            onClick={() => {
              setViewMode(VIEW_EDITING)
              setBlockAnchor(null)
            }}
          >
            Редагувати
          </MenuItem>
          <MenuItem
            onClick={() => {
              setViewMode(VIEW_IMAGES)
              setBlockAnchor(null)
            }}
          >
            Переглянути зображення
          </MenuItem>
          <MenuItem
            onClick={() => {
              changeAvailability()
              setBlockAnchor(null)
            }}
          >
            {!isAvailable && "Помітити як доступний"}
            {isAvailable && "Помітити як не доступний"}
          </MenuItem>
          <MenuItem
            onClick={() => {
              changeWithAction()
              setBlockAnchor(null)
            }}
          >
            {!withAction && "Помітити як акційний"}
            {withAction && "Помітити як не акційний"}
          </MenuItem>
          <MenuItem className="red" onClick={props.delete}>
            Видалити
          </MenuItem>
        </Menu>
      </div>

      {viewMode === VIEW_IMAGES && (
        <>
          <ProductSlider
            dialogPhotos={photos}
            setDialogPhotos={setPhotos}
            editMode={true}
            product={props.id}
          />
        </>
      )}
      {viewMode === VIEW_EDITING && (
        <>
          <TextField
            variant="outlined"
            onChange={(e) => setNewNameUA(e.currentTarget.value)}
            label={`Назва (UA): ${newNameUA.length} / 64`}
            defaultValue={nameUA}
            fullWidth
            margin="dense"
            inputProps={{ maxLength: 64 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewNameRU(e.currentTarget.value)}
            label={`Назва (RU): ${newNameRU.length} / 64`}
            defaultValue={nameRU}
            fullWidth
            margin="dense"
            inputProps={{ maxLength: 64 }}
          />
          <AutoComplete
            onChange={(category) => setNewCategory(category.id)}
            defaultValue={props.categories.find((c) => c.id === category)}
            options={props.categories}
            getOptionLabel={(category) => categoryOptionLabel(category)}
            variant="outlined"
            label="Категорія"
          />
          <AutoComplete
            onChange={(filter) => setNewFilter(filter.id)}
            defaultValue={props.filters.find((f) => f.category === category)}
            options={props.filters}
            getOptionLabel={(filter) => filterOptionLabel(filter)}
            variant="outlined"
            label="Фільтр"
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewShortUA(e.currentTarget.value)}
            label={`Підзаголовок (UA): ${newShortUA.length} / 128`}
            defaultValue={shortUA}
            fullWidth
            margin="dense"
            multiline
            inputProps={{ maxLength: 128 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewShortRU(e.currentTarget.value)}
            label={`Підзаголовок (RU): ${newShortRU.length} / 128`}
            defaultValue={shortRU}
            fullWidth
            margin="dense"
            multiline
            inputProps={{ maxLength: 128 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewDescriptionUA(e.currentTarget.value)}
            label={`Опис (UA): ${newDescriptionUA.length} / 1024`}
            defaultValue={descriptionUA}
            fullWidth
            margin="dense"
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewDescriptionRU(e.currentTarget.value)}
            label={`Опис (RU): ${newDescriptionRU.length} / 1024`}
            defaultValue={descriptionRU}
            fullWidth
            margin="dense"
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewInstructionUA(e.currentTarget.value)}
            label={`Інструкція (UA): ${instructionUA.length} / 1024`}
            defaultValue={instructionUA}
            fullWidth
            margin="dense"
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewInstructionRU(e.currentTarget.value)}
            label={`Інструкція (RU): ${instructionRU.length} / 1024`}
            defaultValue={instructionRU}
            fullWidth
            margin="dense"
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewComponentsUA(e.currentTarget.value)}
            label={`Склад (UA): ${componentsUA.length} / 1024`}
            defaultValue={componentsUA}
            fullWidth
            margin="dense"
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewComponentsRU(e.currentTarget.value)}
            label={`Склад (RU): ${componentsRU.length} / 1024`}
            defaultValue={componentsRU}
            fullWidth
            margin="dense"
            multiline
            inputProps={{ maxLength: 1024 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewPrice(e.currentTarget.value)}
            label="Ціна"
            defaultValue={price}
            fullWidth
            margin="dense"
            type="number"
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewUpdatedPrice(e.currentTarget.value)}
            label="Акційна ціна"
            defaultValue={updatedPrice}
            fullWidth
            margin="dense"
            type="number"
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewSize(e.currentTarget.value)}
            label="Розмір / Об'єм"
            defaultValue={size}
            fullWidth
            margin="dense"
            type="number"
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewAdditionalSize(e.currentTarget.value)}
            label="Додатковий розмір / Об'єм"
            defaultValue={additionalSize}
            fullWidth
            margin="dense"
            type="number"
          />
          <div className="Bubble--editgroup">
            <Button color="primary" onClick={() => setViewMode(0)}>
              Відміна
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={applyEdit}
              disabled={!hasFieldChanged()}
              disableElevation
            >
              Зберегти
            </Button>
          </div>
        </>
      )}
      {viewMode === VIEW_DEFAULT && (
        <>
          {!isAvailable && (
            <Typography variant="button" style={{ color: "red" }}>
              Товару не має в наявності
            </Typography>
          )}

          <Typography variant="button">
            Назва (UA): <span className="gray">{nameUA}</span>
          </Typography>
          <Typography variant="button">
            Ціна <span className="gray">{price}</span>
          </Typography>
          <div className="Toggle">
            <IconButton onClick={() => setViewMode(VIEW_EXPANDED)}>
              <ExpandMore />
            </IconButton>
          </div>
        </>
      )}
      {viewMode === VIEW_EXPANDED && (
        <>
          {!isAvailable && (
            <Typography variant="button" style={{ color: "red" }}>
              Товару не має в наявності
            </Typography>
          )}
          <Typography variant="button">
            Назва (UA): <span className="gray">{nameUA}</span>
          </Typography>
          <Typography variant="button">
            Назва (RU): <span className="gray">{nameRU}</span>
          </Typography>
          <Typography variant="button">
            Категорія: <span className="gray">{categoryLabel()}</span>
          </Typography>
          <Typography variant="button">
            Фільтр: <span className="gray">{filterLabel()}</span>
          </Typography>
          <Typography variant="button">
            Підзаголовок (UA): <span className="gray">{shortUA}</span>
          </Typography>
          <Typography variant="button">
            Підзаголовок (RU): <span className="gray">{shortRU}</span>
          </Typography>
          <Typography variant="button">
            Опис (UA): <span className="gray">{descriptionUA}</span>
          </Typography>
          <Typography variant="button">
            Опис (RU): <span className="gray">{descriptionRU}</span>
          </Typography>
          <Typography variant="button">
            Інструкція (UA): <span className="gray">{instructionUA}</span>
          </Typography>
          <Typography variant="button">
            Інструкція (RU): <span className="gray">{instructionRU}</span>
          </Typography>
          <Typography variant="button">
            Склад (UA): <span className="gray">{componentsUA}</span>
          </Typography>
          <Typography variant="button">
            Склад (RU): <span className="gray">{componentsRU}</span>
          </Typography>
          <Typography variant="button">
            Ціна <span className="gray">{price}</span>
          </Typography>
          <Typography variant="button">
            Акційна ціна: <span className="gray">{updatedPrice}</span>
          </Typography>
          <Typography variant="button">
            Розмір / об'єм <span className="gray">{size}</span>
          </Typography>
          <Typography variant="button">
            Додатковий розмір / об'єм{" "}
            <span className="gray">{additionalSize}</span>
          </Typography>
          <div className="Toggle">
            <IconButton onClick={() => setViewMode(VIEW_DEFAULT)}>
              <ExpandLess />
            </IconButton>
          </div>
        </>
      )}
    </Bubble>
  )
}

export default ProductBlock
