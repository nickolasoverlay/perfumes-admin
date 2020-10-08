import React, { useState, useEffect } from "react"
import axios from "axios"
import { connect } from "react-redux"

import {
  Typography,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Badge,
  MenuItem,
} from "@material-ui/core"

import { MoreVert as MoreVertIcon } from "@material-ui/icons"

import Menu from "./../../ui/Menu"
import Wrapper from "./../../ui/Wrapper"
import Snackbar from "./../../ui/Snackbar"
import Bubble from "./../../ui/Bubble"
import AutoComplete from "./../../ui/AutoComplete"

import "./Filters.css"

const FilterBlock = (props) => {
  const [nameUA, setNameUA] = useState(props.filter.name_ua)
  const [nameRU, setNameRU] = useState(props.filter.name_ru)

  const [newNameUA, setNewNameUA] = useState(props.filter.name_ua)
  const [newNameRU, setNewNameRU] = useState(props.filter.name_ru)

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

    setIsEditing(false)
  }

  const applyEdit = () => {
    if (
      (newNameUA !== nameUA && newNameUA.length !== 0) ||
      (newNameRU !== nameRU && newNameRU.length !== 0)
    ) {
      const updatedCategory = new FormData()

      updatedCategory.append("id", props.filter.id)
      updatedCategory.append("nameUA", newNameUA)
      updatedCategory.append("nameRU", newNameRU)

      axios
        .post("/admin/filters/update/", updatedCategory)
        .then((res) => {
          setSnackbarSeverity("success")
          setSnackbarMessage("Фільтр успішно оновлено")
          setSnackbarOpen(true)

          if (newNameUA !== "") {
            setNameUA(newNameUA)
          }
          if (newNameRU !== "") {
            setNameRU(newNameRU)
          }
        })
        .catch((err) => {
          setSnackbarSeverity("error")
          setSnackbarMessage("Не вдалось оновити фільтр")
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

  const handleDelete = () => {
    const data = new FormData()
    data.append("id", props.filter.id)

    axios
      .post("/admin/filters/delete/", data)
      .then((res) => {
        setSnackbarSeverity("success")
        setSnackbarMessage("Фільтр успішно видалено")
        setSnackbarOpen(true)

        props.setFilters(
          props.filters.filter((filter) => filter.id !== props.filter.id)
        )
      })
      .catch((err) => {
        setSnackbarSeverity("error")
        setSnackbarMessage("Не вдалося видалити фільтр")
        setSnackbarOpen(true)
      })
      .finally(() => {
        setNewNameUA(nameUA)
        setNewNameRU(nameRU)
        setBlockAnchor(null)
      })
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
              <MenuItem className="red" onClick={handleDelete}>
                Видалити
              </MenuItem>
            </Menu>
          </div>
          <Typography variant="button">
            Категорія: <span>{props.categoryLabel}</span>
          </Typography>
          <Typography variant="button">
            Назва (UA): <span>{nameUA}</span>
          </Typography>
          <Typography variant="button">
            Назва (RU): <span>{nameRU}</span>
          </Typography>
        </>
      )}
    </Bubble>
  )
}

const Filters = (props) => {
  const { isLoggedIn } = props

  const [groups, setGroups] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState([])

  const [categoryIndex, setCategoryIndex] = useState(0) // Index of category
  const [categoryAnchor, setCategoryAnchor] = useState(null)

  const [openDialog, setOpenDialog] = useState(false)

  const [nameUA, setNameUA] = useState("")
  const [nameRU, setNameRU] = useState("")
  const [category, setCategory] = useState(0)

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
      axios("/admin/categories/").then((res) => {
        setCategories(res.data)
      })
      axios("/admin/filters/").then((res) => {
        setFilters(res.data)
      })
    }
  }, [isLoggedIn])

  const closeDialog = () => {
    setNameUA("")
    setNameRU("")
    setOpenDialog(false)
  }

  const handleNameUA = (e) => {
    if (e.target.value.length <= 64) {
      setNameUA(e.target.value)
    }
  }

  const handleNameRU = (e) => {
    if (e.target.value.length <= 64) {
      setNameRU(e.target.value)
    }
  }

  const isValid = nameUA !== "" && nameRU !== "" && category !== 0

  const handleSubmit = () => {
    const data = new FormData()

    data.append("category", category)
    data.append("nameUA", nameUA)
    data.append("nameRU", nameRU)

    axios
      .post("/admin/filters/create/", data)
      .then((res) => {
        setFilters([...filters, res.data])

        setSnackbarSeverity("success")
        setSnackbarMessage("Фільтр успішно добавлено")
      })
      .catch((err) => {
        setSnackbarSeverity("error")
        setSnackbarMessage("Не вдалося добавити фільтр")
      })
      .finally(() => {
        setSnackbarOpen(true)
        closeDialog()
      })
  }

  const getCategoryLabel = (category) => {
    if (category) {
      const group = groups.find((gr) => gr.id === category.group_id)

      if (group) {
        return `[${group.name_ua}] ${category.name_ua} / [${group.name_ru}] ${category.name_ru}`
      }

      return ""
    }

    return ""
  }

  const getCategoryLabelShort = (category) => {
    if (category) {
      const group = groups.find((gr) => gr.id === category.group_id)

      if (group) {
        return `[${group.name_ua}] ${category.name_ua}`
      }

      return ""
    }

    return ""
  }

  const filtersInCategory = (categoryIndex) => {
    const q = filters.filter(
      (filter) => filter.category === categories[categoryIndex].id
    ).length
    return q
  }

  const addDialog = (
    <Dialog open={openDialog} onClose={closeDialog} fullWidth>
      <DialogTitle>Добавлення нового фільтру</DialogTitle>
      <DialogContent>
        <AutoComplete
          onChange={(category) => setCategory(category.id)}
          label="Категорія"
          options={categories}
          getOptionLabel={(c) => getCategoryLabel(c)}
        />
        <TextField
          value={nameUA}
          onChange={handleNameUA}
          margin="dense"
          fullWidth
          label={`Назва (UA) ${nameUA.length} / 64`}
        />
        <TextField
          value={nameRU}
          onChange={handleNameRU}
          margin="dense"
          fullWidth
          label={`Назва (RU) ${nameRU.length} / 64`}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="text" onClick={closeDialog}>
          Відміна
        </Button>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Добавити
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Wrapper>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
      {addDialog}
      <div className="ActionBar">
        <div className="ActionBar--title">Фільтри</div>
        <div>
          {categories && categories.length !== 0 && (
            <>
              <Button
                onClick={(e) => setCategoryAnchor(e.target)}
                color="primary"
                variant="contained"
                disableElevation
              >
                Категорія: {getCategoryLabelShort(categories[categoryIndex])}
                <Badge
                  color="secondary"
                  badgeContent={filtersInCategory(categoryIndex)}
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
                      {getCategoryLabelShort(category)}
                      <Badge
                        color="secondary"
                        badgeContent={filtersInCategory(index)}
                      ></Badge>
                    </MenuItem>
                  )
                })}
              </Menu>
            </>
          )}
          <Button
            onClick={() => setOpenDialog(true)}
            color="primary"
            variant="contained"
            style={{ marginLeft: "15px" }}
            disableElevation
          >
            Новий фільтр
          </Button>
        </div>
      </div>
      <div className="Filters">
        {categories.length === 0 && (
          <Typography variant="h5" className="NoData">
            Потрібно створити хоча б одну категорію
          </Typography>
        )}
        {categories.length !== 0 && filters && filters.length === 0 && (
          <Typography variant="h5" className="NoData">
            Не має жодного фільтру
          </Typography>
        )}
        {/* TODO: Simplify bottom statement */}
        {filters &&
          filters.length !== 0 &&
          categories[categoryIndex] &&
          filters.filter(
            (filter) => filter.category === categories[categoryIndex].id
          ).length === 0 && (
            <Typography variant="h5" className="NoData">
              Категорія не має фільтрів
            </Typography>
          )}
        {categories &&
          categories.length !== 0 &&
          filters
            .filter(
              (filter) => filter.category === categories[categoryIndex].id
            )
            .map((filter) => {
              return (
                <FilterBlock
                  filters={filters}
                  filter={filter}
                  setFilters={setFilters}
                  key={filter.id}
                  categoryLabel={getCategoryLabel(
                    categories.find((c) => c.id === filter.category)
                  )}
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

export default connect(mapStateToProps)(Filters)
