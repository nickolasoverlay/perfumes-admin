import React from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import "./Left.css";

import * as actions from "./../store/actions";

const Left = (props) => {
    const { logOut } = props;

    const handleLogOut = () => {
        axios("/admin/logout/")
            .then((res) => {
                logOut();
            })
            .catch((err) => {});
    };

    return (
        <>
            {props.authState.isLoggedIn && (
                <div className="Left">
                    <div className="Left--title">{props.authState.name}</div>
                    <div className="Left--list">
                        <NavLink to="/category_groups" exact>
                            <Button fullWidth>Колекції</Button>
                        </NavLink>
                        <NavLink to="/categories" exact>
                            <Button fullWidth>Категорії</Button>
                        </NavLink>
                        <NavLink to="/filters" exact>
                            <Button fullWidth>Фільтри</Button>
                        </NavLink>
                        <NavLink to="/products" exact>
                            <Button fullWidth>Товари</Button>
                        </NavLink>
                        {
                            //<NavLink to="/home_slider" exact>
                            //<Button fullWidth>Слайдер пропозицій</Button>
                            //</NavLink>
                        }
                        <NavLink to="/orders" exact>
                            <Button fullWidth>Замовлення</Button>
                        </NavLink>
                        <NavLink to="/blog" exact>
                            <Button fullWidth>Блог</Button>
                        </NavLink>
                        <NavLink to="/messages" exact>
                            <Button fullWidth>Повідомлення</Button>
                        </NavLink>
                    </div>
                    <Button color="secondary" onClick={handleLogOut}>
                        Вийти
                    </Button>
                </div>
            )}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        authState: state.authReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => dispatch({ type: actions.LOG_OUT }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Left);
