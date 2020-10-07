import React, { useState, useEffect } from "react"
import axios from "axios"
import { connect } from "react-redux"
import Wrapper from "./../../ui/Wrapper"
import "./Orders.css"
import Bubble from "./../../ui/Bubble"
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
  Badge,
  Button,
} from "@material-ui/core"
import { MoreVert } from "@material-ui/icons"

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

const sectionEmptyString = (section) => {
  switch (section) {
    case OrderStatusInitiated:
      return "Жодне замовлення не очікує обробки"
    case OrderStatusInProcess:
      return "Жодне замовлення наразі не обробляється"
    case OrderStatusInDelivery:
      return "Жодне замовлення не здаходиться в доставці"
    case OrderStatusCancelled:
      return "Жодне замовлення не було скасоване"
    case OrderStatusSuccessfull:
      return "Жодне замовлення не було успішно виконане"
    default:
      break
  }
}

const OrderItem = ({ info, product }) => {
  const ViewDefault = 0
  const ViewImage = 1

  const [viewMode, setViewMode] = useState(ViewDefault)
  const [blockAnchor, setBlockAnchor] = useState(null)

  return (
    <Bubble className={viewMode === ViewImage ? "Bubble wide" : "Bubble"}>
      <div className="Bubble--menu">
        <IconButton onClick={(e) => setBlockAnchor(e.currentTarget)}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={blockAnchor}
          open={Boolean(blockAnchor)}
          onClose={() => setBlockAnchor(null)}
        >
          {viewMode !== ViewDefault && (
            <MenuItem
              onClick={() => {
                setViewMode(ViewDefault)
                setBlockAnchor(null)
              }}
            >
              Згорнути
            </MenuItem>
          )}
          {viewMode === ViewDefault && (
            <MenuItem
              onClick={() => {
                setViewMode(ViewImage)
                setBlockAnchor(null)
              }}
            >
              Переглянути зображення
            </MenuItem>
          )}
        </Menu>
      </div>
      {viewMode === ViewImage && (
        <div className="Order--item--slider">
          <div className="Order-item--slider--container">
            {product.picture.split(",").map((pic) => {
              return (
                <div
                  key={pic}
                  style={{
                    background:
                      "url(" +
                      process.env.REACT_APP_API +
                      "/media/" +
                      pic +
                      ")",
                  }}
                ></div>
              )
            })}
          </div>
          <div className="Order--item--slider--indicator">
            {product.picture.split(",").map((pic) => {
              return <div key={pic} className="Order--item--slider--btn"></div>
            })}
          </div>
        </div>
      )}
      {viewMode === ViewDefault && (
        <>
          <Typography variant="button">
            Назва товару: <span className="gray">{product.name_ua}</span>
          </Typography>
          <Typography variant="button">
            Кількість: <span className="gray">{info.quantity}</span>
          </Typography>
          <Typography variant="button">
            Ціна на момент покупки:{" "}
            <span className="gray">{info.product_price}</span>
          </Typography>
          <Typography variant="button">
            Сума на момент покупки:{" "}
            <span className="gray">{info.product_price * info.quantity}</span>
          </Typography>
          {info.product_price !== product.price && (
            <>
              <Typography variant="button">
                Ціна зараз: <span className="gray">{product.price}</span>
              </Typography>
              <Typography variant="button">
                Сума зараз:{" "}
                <span className="gray">{product.price * info.quantity}</span>
              </Typography>
            </>
          )}
        </>
      )}
    </Bubble>
  )
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

const Orders = (props) => {
  const { isLoggedIn } = props

  const [orders, setOrders] = useState([])
  const [isMounted, setIsMounted] = useState(false)
  const [section, setSection] = useState(OrderStatusInitiated)

  useEffect(() => {
    if (isLoggedIn) {
      axios(`${process.env.REACT_APP_API}/admin/orders/`, {
        withCredentials: true,
      })
        .then((res) => {
          console.log("AVAILABLE_ORDERS: ", res.data)
          setOrders(res.data)
        })
        .catch((error) => {
          console.log("AVAILABLE_ORDERS_ERROR: ", error)
        })
        .finally(setIsMounted(true))
    }
  }, [isLoggedIn])

  const updateOrderStatus = (id, status) => {
    const ordersCopy = [...orders]
    ordersCopy[
      ordersCopy.findIndex((order) => order.info.id === id)
    ].info.order_status = status

    console.log("Updated orders copy is :", ordersCopy)

    setOrders(ordersCopy)
  }

  return (
    <Wrapper>
      <div className="ActionBar">
        <div className="ActionBar--title">Замовлення</div>
      </div>
      <div className="ActionBar Orders--filterbar">
        <Button
          variant="text"
          className={String(section === OrderStatusInitiated && "active")}
          onClick={() => setSection(OrderStatusInitiated)}
        >
          <Badge
            color="primary"
            badgeContent={
              orders.filter(
                (order) => order.info.order_status === OrderStatusInitiated
              ).length
            }
          >
            Очікують обробки
          </Badge>
        </Button>
        <Button
          variant="text"
          className={String(section === OrderStatusInProcess && "active")}
          onClick={() => setSection(OrderStatusInProcess)}
        >
          <Badge
            color="primary"
            badgeContent={
              orders.filter(
                (order) => order.info.order_status === OrderStatusInProcess
              ).length
            }
          >
            Обробляються
          </Badge>
        </Button>
        <Button
          variant="text"
          className={String(section === OrderStatusInDelivery && "active")}
          onClick={() => setSection(OrderStatusInDelivery)}
        >
          <Badge
            color="primary"
            badgeContent={
              orders.filter(
                (order) => order.info.order_status === OrderStatusInDelivery
              ).length
            }
          >
            Доставляються
          </Badge>
        </Button>
        <Button
          variant="text"
          className={String(section === OrderStatusSuccessfull && "active")}
          onClick={() => setSection(OrderStatusSuccessfull)}
        >
          <Badge
            color="primary"
            badgeContent={
              orders.filter(
                (order) => order.info.order_status === OrderStatusSuccessfull
              ).length
            }
          >
            Успішно завершені
          </Badge>
        </Button>
        <Button
          variant="text"
          className={String(section === OrderStatusCancelled && "active")}
          onClick={() => setSection(OrderStatusCancelled)}
        >
          <Badge
            color="primary"
            badgeContent={
              orders.filter(
                (order) => order.info.order_status === OrderStatusCancelled
              ).length
            }
          >
            Скасовані замовлення
          </Badge>
        </Button>
      </div>
      <div className="Orders">
        {isMounted &&
          (orders.filter((order) => order.info.order_status === section)
            .length === 0 ? (
            <Typography variant="h5" className="NoData">
              {sectionEmptyString(section)}
            </Typography>
          ) : (
            <>
              {orders
                .filter((order) => order.info.order_status === section)
                .map((order, index) => {
                  return (
                    <OrderBlock
                      {...order}
                      index={index}
                      onStatusUpdate={updateOrderStatus}
                      key={order.info.id}
                    />
                  )
                })}
            </>
          ))}
      </div>
    </Wrapper>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authReducer.isLoggedIn,
  }
}

export default connect(mapStateToProps)(Orders)
