import React, { useState } from "react"
import Bubble from "./../../ui/Bubble"
import { IconButton, Typography, MenuItem } from "@material-ui/core"
import Menu from "./../../ui/Menu"
import { MoreVert } from "@material-ui/icons"

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

export default OrderItem
