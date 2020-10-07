import React from "react"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"

const Alert = props => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const CustomSnackbar = ({ open, severity, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default CustomSnackbar
