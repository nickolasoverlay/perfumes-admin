import React from "react";
import { connect } from "react-redux";

import "./Home.css";

const Home = () => {
    return <div>{null}</div>;
};

const mapStateToProps = (state) => {
    return {
        authState: state.authReducer,
    };
};

export default connect(mapStateToProps)(Home);
