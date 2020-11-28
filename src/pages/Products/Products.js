import React, { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { connect } from "react-redux"
import Wrapper from "./../../ui/Wrapper"
import Menu from "./../../ui/Menu"
import Snackbar from "./../../ui/Snackbar"
import { Button, Typography, Badge, MenuItem } from "@material-ui/core"

import ProductBlock from "./ProductBlock"
import ProductDialog from "./ProductDialog"

import "./Products.css"

const Products = (props) => {
  const { isLoggedIn } = props

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState([])

  const [categoryIndex, setCategoryIndex] = useState(0) // Index of category
  const [categoryAnchor, setCategoryAnchor] = useState(null)

  // Dialog state - different sections for photos and text info
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      axios("/admin/products/")
        .then((res) => {
          setProducts(res.data.products)
          setCategories(res.data.categories)
          setFilters(res.data.filters)
        })
        .catch((err) => {})
    }
  }, [isLoggedIn])

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const closeSnackbar = () => setSnackbarOpen(false)

  const deleteProduct = (id) => {
    const data = new FormData()
    data.append("id", id)

    axios
      .post("/admin/products/delete/", data)
      .then((res) => {
        setSnackbarSeverity("success")
        setSnackbarMessage("Товар успішно видалено")
        setSnackbarOpen(true)

        setProducts(products.filter((p) => p.id !== id))
      })
      .catch((err) => {
        setSnackbarSeverity("error")
        setSnackbarMessage("Не вдалося видалити товар")
        setSnackbarOpen(true)
      })
  }

  /**
   * Returns number of products in category at provided index
   * @param {Number} ctIndex
   */
  const productsInCategory = (ctIndex) => {
    const q = products.filter(
      (product) => product.category === categories[ctIndex].id
    ).length
    return q
  }

  const onSuccess = (added) => {
    setSnackbarSeverity("success")
    setSnackbarMessage("Товар успішно створено")
    setSnackbarOpen(true)
    setProducts((p) => p.concat(added))
  }

  const onError = () => {
    setSnackbarSeverity("error")
    setSnackbarMessage("Не вдалося створити новий товар")
    setSnackbarOpen(true)
  }

  return (
    <Wrapper>
      <ProductDialog
        filters={filters}
        categories={categories}
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
        onSuccess={onSuccess}
        onError={onError}
      />
      <Snackbar
        message={snackbarMessage}
        open={snackbarOpen}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
      <div className="ActionBar ProductsActionBar">
        <div className="ActionBar--title">Товари</div>
        <div>
          {categories && categories.length !== 0 && (
            <>
              <Button
                onClick={(e) => setCategoryAnchor(e.target)}
                color="primary"
                variant="contained"
                disableElevation
              >
                Категорія: {categories[categoryIndex].name_ua}
                <Badge
                  color="secondary"
                  badgeContent={productsInCategory(categoryIndex)}
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
                      {category.name_ua}
                      <Badge
                        color="secondary"
                        badgeContent={productsInCategory(index)}
                      ></Badge>
                    </MenuItem>
                  )
                })}
              </Menu>
            </>
          )}
          <Button
            style={{ marginLeft: "15px" }}
            onClick={() => setOpenDialog(true)}
            color="primary"
            variant="contained"
            disableElevation
          >
            Добавити товар
          </Button>
        </div>
      </div>
      <div className="Products Shell">
        {categories.length === 0 && (
          <Typography variant="h5" className="NoData">
            Створіть хоча б одну категорію
          </Typography>
        )}
        {categories &&
          categories.length !== 0 &&
          products.filter(
            (product) => product.category === categories[categoryIndex].id
          ).length === 0 && (
            <Typography variant="h5" className="NoData">
              В цій категорії немає жодного товару
            </Typography>
          )}
        {categories &&
          categories.length !== 0 &&
          products
            .filter(
              (product) => product.category === categories[categoryIndex].id
            )
            .map((product) => {
              return (
                <ProductBlock
                  key={product.id}
                  delete={() => deleteProduct(product.id)}
                  {...product}
                  categories={categories}
                  filters={filters}
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

export default connect(mapStateToProps)(Products)
