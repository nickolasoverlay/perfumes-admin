import React from "react";
import { TextField } from "@material-ui/core";

import "./DialogTextField.css";

const DialogTextField = React.forwardRef((props: any, ref: any) => {
  return <TextField fullWidth ref={ref} {...props} />;
});

export default DialogTextField;
