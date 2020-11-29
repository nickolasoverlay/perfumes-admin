import React, { useState, useEffect } from "react"
import axios from "axios"
import { connect } from "react-redux"

import {
  Typography,
  Button,
} from "@material-ui/core"

import GroupBlock from "./GroupBlock"
import AddGroupDialog from "./AddGroupDialog"

import Wrapper from "./../../ui/Wrapper"
import Snackbar from "./../../ui/Snackbar"

import "./CategoryGroups.css"

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

  return (
    <Wrapper>
      {openDialog &&
      <AddGroupDialog
        closeDialog={() => setOpenDialog(false)}
        setGroups={setGroups}
      />
      }
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
