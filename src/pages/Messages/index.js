import React, { useState, useEffect } from "react"
import axios from "axios"
import { connect } from "react-redux"

import {
  Button,
  Badge,
  Typography,
  IconButton,
  MenuItem
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"

import Wrapper from "./../../ui/Wrapper"
import Bubble from "./../../ui/Bubble"
import Menu from "../../ui/Menu"
import Snackbar from "../../ui/Snackbar"

const MessageBlock = ({ message, changeStatus }) => {
  const [blockAnchor, setBlockAnchor] = useState(null)

  return (
    <Bubble>
      <div className="Bubble--menu">
        <IconButton onClick={e => setBlockAnchor(e.target)}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={blockAnchor}
          onClose={() => setBlockAnchor(null)}
          open={Boolean(blockAnchor)}
        >
          <MenuItem
            onClick={() => {
              changeStatus(message.id, !message.answered)
              setBlockAnchor(null)
            }}
          >
            {message.answered && "Помітити як необроблене"}
            {!message.answered && "Помітити як оброблене"}
          </MenuItem>
        </Menu>
      </div>
      <Typography variant="button">Текст:</Typography>
      <Typography variant="button">
        <span
          className="gray"
          style={{ display: "inline-block", marginLeft: "15px" }}
        >
          {message.text}
        </span>
      </Typography>
      {message.name && (
        <Typography variant="button">
          Ім'я відправника: <span className="gray">{message.name}</span>
        </Typography>
      )}
      {message.email && (
        <Typography variant="button">
          Електронна пошта: <span className="gray">{message.email}</span>
        </Typography>
      )}
      {message.phone && (
        <Typography variant="button">
          Номер телефону: <span className="gray">{message.phone}</span>
        </Typography>
      )}
      {message.user_id !== 0 && (
        <Typography variant="button">
          ID користувача: <span className="gray">{message.user_id}</span>
        </Typography>
      )}
    </Bubble>
  )
}

const Messages = ({ isLoggedIn }) => {
  const [messages, setMessages] = useState([])
  const [section, setSection] = useState(0)

  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarSeverity, setSnackBarSeverity] = useState("success")
  const [snackBarMessage, setSnackBarMessage] = useState("")

  useEffect(() => {
    axios(`${process.env.REACT_APP_API}/admin/messages/`, {
      withCredentials: true
    }).then(res => {
      setMessages([...res.data])
    })
  }, [isLoggedIn])

  const changeStatus = (id, newStatus) => {
    const data = new FormData()
    data.append("id", id)
    data.append("answered", newStatus)

    axios
      .post(
        `${process.env.REACT_APP_API}/admin/messages/change_status/`,
        data,
        { withCredentials: true }
      )
      .then(res => {
        const m = [...messages]
        const index = m.findIndex(m => m.id === id)
        m[index].answered = newStatus

        setMessages(m)

        if (newStatus) {
          setSnackBarMessage(`Повідомлення #${id} позначене як оброблене`)
        } else {
          setSnackBarMessage(`Повідомлення #${id} позначене як не оброблене`)
        }
        setSnackBarSeverity("success")
      })
      .catch(err => {
        if (newStatus) {
          setSnackBarMessage(
            `Не вдалось позначити повідомлення #${id} як оброблене`
          )
        } else {
          setSnackBarMessage(
            `Не вдалось позначити повідомлення #${id} як не оброблене`
          )
        }
        setSnackBarSeverity("error")
      })
      .finally(setSnackBarOpen(true))
  }

  return (
    <Wrapper>
      <Snackbar
        open={snackBarOpen}
        severity={snackBarSeverity}
        message={snackBarMessage}
      />
      <div className="ActionBar">
        <div className="ActionBar--title">Повідомлення користувачів</div>
      </div>
      <div className="ActionBar Orders--filterbar">
        <Button
          variant="text"
          className={String(section === 0 && "active")}
          onClick={() => setSection(0)}
        >
          <Badge
            color="primary"
            badgeContent={messages.filter(m => m.answered === false).length}
          >
            Очікують відповіді
          </Badge>
        </Button>
        <Button
          variant="text"
          className={String(section === 1 && "active")}
          onClick={() => setSection(1)}
        >
          <Badge
            color="primary"
            badgeContent={messages.filter(m => m.answered === true).length}
          >
            Оброблені Повідомлення
          </Badge>
        </Button>
      </div>
      <div
        className="Messages"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap"
        }}
      >
        {messages
          .filter(m => m.answered === Boolean(section))
          .map(m => (
            <MessageBlock message={m} key={m.id} changeStatus={changeStatus} />
          ))}
      </div>
    </Wrapper>
  )
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.authReducer.isLoggedIn
  }
}

export default connect(mapStateToProps)(Messages)
