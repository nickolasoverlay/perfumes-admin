import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import axios from "axios"
import {
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Badge,
  MenuItem,
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"

import Wrapper from "./../../ui/Wrapper"
import Menu from "./../../ui/Menu"
import Bubble from "./../../ui/Bubble"
import AutoComplete from "./../../ui/AutoComplete"
import Snackbar from "./../../ui/Snackbar"

import "./Categories.css"

const CategoryBlock = (props) => {
  const [nameUA, setNameUA] = useState(props.name_ua)
  const [nameRU, setNameRU] = useState(props.name_ru)
  const [shortUA, setShortUA] = useState(props.short_ua)
  const [shortRU, setShortRU] = useState(props.short_ru)
  const [url, setURL] = useState(props.url)

  const [newNameUA, setNewNameUA] = useState(props.name_ua)
  const [newNameRU, setNewNameRU] = useState(props.name_ru)
  const [newShortUA, setNewShortUA] = useState(props.short_ua)
  const [newShortRU, setNewShortRU] = useState(props.short_ru)
  const [newURL, setNewURL] = useState(props.url)

  const [blockAnchor, setBlockAnchor] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const closeSnackbar = () => setSnackbarOpen(false)

  const stopEditing = () => {
    setNewNameUA(nameUA)
    setNewNameRU(nameRU)
    setNewURL(url)
    setNewShortUA(shortUA)
    setNewShortRU(shortRU)

    setIsEditing(false)
  }

  const applyEdit = () => {
    if (
      (newNameUA !== nameUA && newNameUA.length !== 0) ||
      (newNameRU !== nameRU && newNameRU.length !== 0) ||
      (newURL !== url && newURL.length !== 0) ||
      (newShortUA !== shortUA && newShortUA.length !== 0) ||
      (newShortRU !== shortRU && newShortRU.length !== 0)
    ) {
      let updatedCategory = new FormData()

      updatedCategory.append("id", props.id)
      updatedCategory.append("nameUA", newNameUA)
      updatedCategory.append("nameRU", newNameRU)
      updatedCategory.append("shortUA", newShortUA)
      updatedCategory.append("shortRU", newShortRU)
      updatedCategory.append("url", newURL)

      axios
        .post("/admin/categories/update/", updatedCategory)
        .then((res) => {
          setSnackbarSeverity("success")
          setSnackbarMessage("Категорія успішно оновлена")
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
          if (newShortUA !== "") {
            setShortUA(newShortUA)
          }
          if (newShortRU !== "") {
            setShortRU(newShortRU)
          }
        })
        .catch((err) => {
          setSnackbarSeverity("error")
          setSnackbarMessage("Не вдалося оновити категорію")
          setSnackbarOpen(true)
          console.log("UPDATE_CATEGORY_ERR: ", err)
        })
    }

    setIsEditing(false)
  }

  const getGroupURL = () => {
    const g = props.groups.find((gr) => gr.id === props.group_id)

    if (!g) return ""

    return g.url + "#" + props.url
  }

  const getGroupName = () => {
    const g = props.groups.find((gr) => gr.id === props.group_id)

    if (!g) return ""

    return g.name_ua + "/" + g.name_ru
  }

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
          <TextField
            variant="outlined"
            onChange={(e) => setNewNameUA(e.target.value)}
            defaultValue={nameUA}
            label={`Назва (UA): ${newNameUA.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewNameRU(e.target.value)}
            defaultValue={nameRU}
            label={`Назва (RU): ${newNameRU.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewShortUA(e.target.value)}
            defaultValue={shortUA}
            label={`Підзаголовок (UA): ${newShortUA.length} / 128`}
            margin="dense"
            multiline
            inputProps={{ maxLength: 128 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewShortRU(e.target.value)}
            defaultValue={shortRU}
            label={`Підзаголовок (RU): ${newShortRU.length} / 128`}
            margin="dense"
            multiline
            inputProps={{ maxLength: 128 }}
          />
          <TextField
            variant="outlined"
            onChange={(e) => setNewURL(e.target.value)}
            defaultValue={url}
            label={`Посилання : ${url.length} / 64`}
            margin="dense"
            inputProps={{ maxLength: 64 }}
            InputProps={{
              startAdornment: <InputAdornment>{getGroupURL()}</InputAdornment>,
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
              Колекція: <span>{getGroupName()}</span>
            </Typography>
            <Typography variant="button">
              Назва (UA): <span>{nameUA}</span>
            </Typography>
            <Typography variant="button">
              Назва (RU): <span>{nameRU}</span>
            </Typography>
            <Typography variant="button">
              Товарів в категорії: <span>{props.items_available}</span>
            </Typography>
            <Typography variant="button">
              Посилання:{" "}
              <span className="aqua">
                https://yva.com.ua/collections/
              {getGroupURL()}
              </span>
            </Typography>
          </>
        )}
    </Bubble>
  )
}

const Categories = (props) => {
  const { isLoggedIn } = props

  const [categories, setCategories] = useState([])
  const [groups, setGroups] = useState([])

  const [group, setGroup] = useState(0)
  const [nameUA, setNameUA] = useState("")
  const [nameRU, setNameRU] = useState("")
  const [shortUA, setShortUA] = useState("")
  const [shortRU, setShortRU] = useState("")
  const [url, setURL] = useState("")

  const [openDialog, setOpenDialog] = useState(false)

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const closeSnackbar = () => setSnackbarOpen(true)

  // Group stuff
  const [groupAnchor, setGroupAnchor] = useState(null)
  const [groupIndex, setGroupIndex] = useState(0)

  useEffect(() => {
    if (isLoggedIn) {
      axios("/admin/category_groups/").then((res) => {
        console.log("AVAILABLE_CATEGORIES: ", res.data)
        setGroups(res.data)
      })

      axios("/admin/categories/").then((res) => {
        console.log("AVAILABLE_CATEGORIES: ", res.data)
        setCategories(res.data)
      })
    }
  }, [isLoggedIn])

  const closeDialog = () => {
    setGroup(0)
    setNameUA("")
    setNameRU("")
    setURL("")
    setOpenDialog(false)
  }

  const addCategory = () => {
    let category = new FormData()

    category.append("group", group)
    category.append("nameUA", nameUA)
    category.append("nameRU", nameRU)
    category.append("shortUA", shortUA)
    category.append("shortRU", shortRU)
    category.append("url", url)

    axios
      .post("/admin/categories/create/", category)
      .then((res) => {
        setSnackbarSeverity("success")
        setSnackbarMessage("Категорія успішно добавлена")
        setSnackbarOpen(true)

        console.log("POST_CATEGORY: ", res.data)
        setCategories((c) => c.concat(res.data))
      })
      .catch((err) => {
        setSnackbarSeverity("error")
        setSnackbarMessage("Не вдалося добавити категорію")
        setSnackbarOpen(true)

        console.log("POST_CATEGORY_ERR: ", err)
      })
      .finally(closeDialog())
  }

  const deleteCategory = (id) => {
    const data = new FormData()

    data.append("id", id)

    axios
      .post("/admin/categories/delete/", data)
      .then((res) => {
        setSnackbarSeverity("success")
        setSnackbarMessage("Категорія успішно видалена")
        setSnackbarOpen(true)

        setCategories(categories.filter((category) => category.id !== id))
      })
      .catch((err) => {
        setSnackbarSeverity("error")
        setSnackbarMessage("Не вдалось видалити категорію")
        setSnackbarOpen(true)
      })
  }

  const handleNameUA = (e) => {
    setNameUA(e.target.value)
  }
  const handleNameRU = (e) => {
    setNameRU(e.target.value)
  }
  const handleShortUA = (e) => {
    setShortUA(e.target.value)
  }
  const handleShortRU = (e) => {
    setShortRU(e.target.value)
  }
  const handleURL = (e) => {
    setURL(e.target.value)
  }

  let isValid =
    group !== 0 &&
    nameUA !== "" &&
    nameRU !== "" &&
    shortUA !== "" &&
    shortRU !== "" &&
    url !== ""

  const getGroupURL = () => {
    const g = groups.find((gr) => gr.id === group)

    if (!g) return ""

    return "https://yva.com.ua/collections/" + g.url + "#"
  }

  const dialog = (
    <Dialog onClose={closeDialog} open={openDialog} fullWidth>
      <DialogTitle>Категорія</DialogTitle>
      <DialogContent>
        <AutoComplete
          onChange={(group) => setGroup(group.id)}
          label="Колекція"
          options={groups}
          getOptionLabel={(group) => group.name_ua + "/" + group.name_ru}
          autoFocus
          required
        />
        <TextField
          onChange={handleNameUA}
          label={`Назва (UA) : ${nameUA.length} / 64`}
          margin="dense"
          inputProps={{ maxLength: 64 }}
          fullWidth
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
          onChange={handleShortUA}
          label={`Підзаголовок (UA) : ${shortUA.length} / 128`}
          margin="dense"
          inputProps={{ maxLength: 128 }}
          fullWidth
          multiline
          required
        />
        <TextField
          onChange={handleShortRU}
          label={`Підзаголовок (RU) : ${shortRU.length} / 128`}
          margin="dense"
          inputProps={{ maxLength: 128 }}
          fullWidth
          multiline
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
            startAdornment: <InputAdornment>{getGroupURL()}</InputAdornment>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={closeDialog}>
          Відміна
        </Button>
        <Button
          color="primary"
          onClick={addCategory}
          variant="contained"
          disableElevation
          disabled={!isValid}
        >
          Добавити
        </Button>
      </DialogActions>
    </Dialog>
  )

  const categoriesInGroup = (groupIndex) => {
    const q = categories.filter(
      (category) => category.group_id === groups[groupIndex].id
    ).length

    return q
  }

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
        <div className="ActionBar--title">Категорії</div>
        <div>
          {groups && groups.length !== 0 && (
            <>
              <Button
                onClick={(e) => setGroupAnchor(e.target)}
                color="primary"
                variant="contained"
                disableElevation
              >
                Колекція: {groups[groupIndex].name_ua}
                <Badge
                  color="secondary"
                  badgeContent={categoriesInGroup(groupIndex)}
                ></Badge>
              </Button>
              <Menu
                anchorEl={groupAnchor}
                open={Boolean(groupAnchor)}
                onClose={() => setGroupAnchor(null)}
              >
                {groups.map((group, index) => {
                  return (
                    <MenuItem
                      key={group.id}
                      onClick={() => {
                        setGroupIndex(index)
                        setGroupAnchor(null)
                      }}
                    >
                      Колекція: {group.name_ua}
                      <Badge
                        color="secondary"
                        badgeContent={categoriesInGroup(index)}
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
            disableElevation
            style={{ marginLeft: "15px" }}
          >
            Нова категорія
          </Button>
        </div>
      </div>
      <div className="Categories Shell">
        {groups.length === 0 && (
          <Typography variant="h5" className="NoData">
            Потрібно створити хоча б одну колекцію
          </Typography>
        )}
        {categories.length === 0 && groups.length !== 0 && (
          <Typography variant="h5" className="NoData">
            Не існує жодної категорії
          </Typography>
        )}
        {categories
          .filter((category) => category.group_id === groups[groupIndex].id)
          .map((category, index) => {
            return (
              <CategoryBlock
                {...category}
                groups={groups}
                delete={() => deleteCategory(category.id)}
                key={category.id}
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
    authState: state.authReducer,
    isLoggedIn: state.authReducer.isLoggedIn,
  }
}

export default connect(mapStateToProps)(Categories)
