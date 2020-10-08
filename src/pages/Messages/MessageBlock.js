import React, { useState } from "react"

import { Typography, IconButton, MenuItem } from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"

import Bubble from "./../../ui/Bubble"
import Menu from "../../ui/Menu"

const MessageBlock = ({ message, changeStatus }) => {
  const [blockAnchor, setBlockAnchor] = useState(null)

  return (
    <Bubble>
      <div className="Bubble--menu">
        <IconButton onClick={(e) => setBlockAnchor(e.target)}>
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

export default MessageBlock
