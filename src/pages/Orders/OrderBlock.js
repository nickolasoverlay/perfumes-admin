import React, { useState } from "react"
import axios from "axios"

import Menu from "./../../ui/Menu"
import {
  IconButton,
  Typography,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core"
import { MoreVert } from "@material-ui/icons"
import OrderItem from "./OrderItem"

const OrderStatusBasket = 1
const OrderStatusInitiated = 2
const OrderStatusInProcess = 3
const OrderStatusInDelivery = 4
const OrderStatusCancelled = 5
const OrderStatusSuccessfull = 6

const statusString = (statusCode) => {
  switch (statusCode) {
    case OrderStatusBasket:
      return "Замовлення в кошику"
    case OrderStatusInitiated:
      return "Замовлення очікує обробку"
    case OrderStatusInProcess:
      return "Замовлення обробляється"
    case OrderStatusInDelivery:
      return "Замовлення доставляється"
    case OrderStatusCancelled:
      return "Замовлення скасовано"
    case OrderStatusSuccessfull:
      return "Замовлення виконано"
    default:
      break
  }
}

const OrderBlock = ({ info, items, index, onStatusUpdate }) => {
  const [menuAnchor, setMenuAnchor] = useState(null)

  const [newStatus, setNewStatus] = useState(info.order_status)
  const [dialogOpen, setDialogOpen] = useState(false)

  const updateStatus = () => {
    const data = new FormData()

    data.append("id", info.id)
    data.append("status", newStatus)

    axios
      .post(`${process.env.REACT_APP_API}/admin/orders/changestatus/`, data, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(
          "UPDATE_ORDER_STATUS OF ORDER",
          info.id,
          "RESULT: ",
          res.data
        )
        onStatusUpdate(info.id, newStatus)
      })
      .catch((err) => {
        console.log(`UPDATE_ORDER_STATUS OF ORDER ${info.id} ERROR: `, err)
      })
      .finally(setDialogOpen(false))
  }

  const updateStatusDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Змінити статус для замовлення #{info.id}</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">Статус замовлення</FormLabel>
          <RadioGroup
            aria-label="status"
            name="status"
            value={newStatus}
            onChange={(e) => setNewStatus(parseInt(e.target.value, 10))}
          >
            <FormControlLabel
              value={OrderStatusInProcess}
              control={<Radio color="primary" />}
              label={statusString(OrderStatusInProcess)}
            />
            <FormControlLabel
              value={OrderStatusInDelivery}
              control={<Radio color="primary" />}
              label={statusString(OrderStatusInDelivery)}
            />
            <FormControlLabel
              value={OrderStatusSuccessfull}
              control={<Radio color="primary" />}
              label={statusString(OrderStatusSuccessfull)}
            />
            <FormControlLabel
              value={OrderStatusCancelled}
              control={<Radio color="primary" />}
              label={statusString(OrderStatusCancelled)}
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => setDialogOpen(false)}>
          Відміна
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={updateStatus}
          disableElevation
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <div key={info.id} className="Order">
      {updateStatusDialog}
      <div className="Order--info">
        <div className="ActionBar Order--info--title">
          <Typography variant="h6">
            {new Date(info.made_at * 1000).toLocaleString()}
          </Typography>
          <IconButton onClick={(e) => setMenuAnchor(e.target)}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            onClose={() => setMenuAnchor(null)}
            open={Boolean(menuAnchor)}
          >
            <MenuItem
              onClick={() => {
                setMenuAnchor(null)
                setDialogOpen(true)
              }}
            >
              Змінити статус замовлення
            </MenuItem>
          </Menu>
        </div>
        <div className="Order--info--data">
          <div>
            <Typography variant="body2">
              Сума за замовлення : {info.total_price}
            </Typography>
            <Typography variant="body2">
              {" "}
              Статус : {statusString(info.order_status)}
            </Typography>
          </div>
          <div>
            {info.user_name && (
              <Typography variant="body2">Ім'я : {info.user_name} </Typography>
            )}
            {info.user_email && (
              <Typography variant="body2">Емейл : {info.user_email}</Typography>
            )}
            {info.user_phone && (
              <Typography variant="body2">
                {" "}
                Телефон : {info.user_phone}{" "}
              </Typography>
            )}
          </div>
        </div>
      </div>
      <div className="Order--items">
        {items.map((orderItem) => {
          return <OrderItem key={orderItem.info.id} {...orderItem} />
        })}
      </div>
    </div>
  )
}

export default OrderBlock
