import React, { useEffect } from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import * as actions from "./store/actions"
import axios from "axios"
import { connect } from "react-redux"

import "./App.css"

import Categories from "./pages/Categories/Categories"
import CategoryGroups from "./pages/CategoryGroups/CategoryGroups"
import Products from "./pages/Products/Products"
import Orders from "./pages/Orders/Orders"
import Admins from "./pages/Admins/Admins"
import HomeSlider from "./pages/HomeSlider"
import Filters from "./pages/Filters/Filters"
import Messages from "./pages/Messages"

const App = (props) => {
  const { logIn } = props

  axios.defaults.baseURL = process.env.REACT_APP_API
  axios.defaults.withCredentials = true

  useEffect(() => {
    axios("/admin/session/")
      .then((res) => {
        logIn(res.data)
      })
      .catch(() => {
        console.log("FAILED_TO_RETRIEVE_SESSION_DATA")
      })
  }, [logIn])

  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/category_groups" />
      </Route>
      <Route exact path="/category_groups" component={CategoryGroups} />
      <Route exact path="/categories" component={Categories} />
      <Route exact path="/products" component={Products} />
      <Route exact path="/orders" component={Orders} />
      <Route exact path="/admins" component={Admins} />
      <Route exact path="/home_slider" component={HomeSlider} />
      <Route exact path="/filters" component={Filters} />
      <Route exact path="/messages" component={Messages} />
    </Switch>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (payload) => dispatch({ type: actions.LOG_IN, payload: payload }),
  }
}

export default connect(null, mapDispatchToProps)(App)
