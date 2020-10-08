import React, { useState } from "react"
import { TextField, Button } from "@material-ui/core"
import * as actions from "./../../store/actions"
import { connect } from "react-redux"
import axios from "axios"

import "./Login.css"

const Login = (props) => {
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(false)

  const logIn = () => {
    const data = new FormData()
    data.append("login", login)
    data.append("password", password)

    axios
      .post("/admin/login/", data)
      .then((res) => {
        props.logIn(res.data)
      })
      .catch(() => {
        setError(true)
      })
  }

  return (
    <div className="Login--container">
      <h1>Адміністратор</h1>

      <TextField
        onChange={(e) => setLogin(e.currentTarget.value)}
        variant="outlined"
        label="Логін"
        margin="dense"
        error={error}
      />
      <TextField
        onChange={(e) => setPassword(e.currentTarget.value)}
        variant="outlined"
        label="Пароль"
        type="password"
        margin="dense"
        error={error}
      />

      <Button
        onClick={logIn}
        variant="contained"
        color="primary"
        disableElevation
      >
        Увійти
      </Button>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (payload) => dispatch({ type: actions.LOG_IN, payload: payload }),
  }
}

export default connect(null, mapDispatchToProps)(Login)
