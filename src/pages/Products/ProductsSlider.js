import React, { useState } from "react"

import { IconButton, Tooltip } from "@material-ui/core"
import { Close, Add } from "@material-ui/icons"

import axios from "axios"

const ProductsSlider = ({
  dialogPhotos,
  setDialogPhotos,
  dialogPhotosChange,
  product,
  editMode
}) => {
  const [curPhoto, setCurPhoto] = useState(0)

  const deletePhoto = () => {
    if (editMode) {
      const data = new FormData()

      data.append("product", product)
      data.append("position", curPhoto)

      console.log(dialogPhotos[curPhoto])

      axios
        .post(
          `${process.env.REACT_APP_API}/admin/products/delete_picture/`,
          data,
          { withCredentials: true }
        )
        .then(res => {
          setDialogPhotos(
            dialogPhotos.filter(photo => photo !== dialogPhotos[curPhoto])
          )
        })
        .catch(err => {})
    } else {
      setDialogPhotos(
        dialogPhotos.filter(photo => photo.url !== dialogPhotos[curPhoto].url)
      )
    }

    setCurPhoto(0)
  }

  const uploadNewPhotos = e => {
    const data = new FormData()

    data.append("product", product)
    data.append("photosQuantity", e.currentTarget.files.length)

    const filesArr = []
    for (let i = 0; i < e.currentTarget.files.length; i++) {
      filesArr.push(e.currentTarget.files[i])
    }

    filesArr.forEach((photo, index) => {
      data.append("photo_" + index, photo)
    })

    axios
      .post(
        `${process.env.REACT_APP_API}/admin/products/add_picture_to_product/`,
        data,
        { withCredentials: true }
      )
      .then(res => {
        console.log(res.data)
        setDialogPhotos([...dialogPhotos, ...res.data])
      })
      .catch(err => {})
  }

  const buidImageURL = () => {
    if (editMode) {
      return process.env.REACT_APP_API + "/media/" + dialogPhotos[curPhoto]
    } else {
      return dialogPhotos[curPhoto].url
    }
  }

  const handleAddChange = e => {
    if (editMode) {
      uploadNewPhotos(e)
    } else {
      dialogPhotosChange(e)
    }
  }

  return (
    <>
      {dialogPhotos.length !== 0 && (
        <div>
          <div
            className={`Products--photoslider--actions${
              editMode ? " EditMode--photoslider" : ""
            }`}
          >
            <input
              type="file"
              multiple
              onChange={e => handleAddChange(e)}
              id="p-file"
              accept="image/*"
              style={{ display: "none" }}
            />
            <Tooltip title="Видалити фото">
              <IconButton onClick={deletePhoto}>
                <Close />
              </IconButton>
            </Tooltip>
            <Tooltip title="Добавити фото">
              <IconButton>
                <label
                  htmlFor="p-file"
                  style={{ display: "flex", cursor: "pointer" }}
                >
                  <Add />
                </label>
              </IconButton>
            </Tooltip>
          </div>
          <div className="Products--photoslider--photos">
            <div
              style={{
                height: "350px",
                width: "400px",
                background: `url('${buidImageURL()}')`
              }}
            />
          </div>
          <div className="Products--photoslider--indicator">
            {dialogPhotos.map((_, i) => {
              return (
                <div
                  key={i.toString()}
                  className={`Products--photoslider--dot${
                    i === curPhoto ? " current" : ""
                  }`}
                  onClick={() => setCurPhoto(i)}
                ></div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default ProductsSlider
