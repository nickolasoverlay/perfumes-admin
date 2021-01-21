import React from "react";
import { connect } from "react-redux";
import Left from "./Left";

import "./Wrapper.css";

const Wrapper = (props) => {
  return (
    <>
      <Left />
      <div className="Wrapper">{props.children}</div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authState: state.authReducer,
  };
};

export default connect(mapStateToProps)(Wrapper);
