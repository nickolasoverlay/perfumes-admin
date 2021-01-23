import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import * as actions from "./store/actions";
import axios from "axios";
import { connect, ConnectedProps } from "react-redux";

import "./App.css";

import Wrapper from "./ui/Wrapper";

import Categories from "./pages/Categories/Categories";
import Category from "./pages/Categories/Category";

import CategoryGroups from "./pages/CategoryGroups/CategoryGroups";
import CategoryGroup from "./pages/CategoryGroups/CategoryGroup";

import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Admins from "./pages/Admins/Admins";
import HomeSlider from "./pages/HomeSlider";

import Filters from "./pages/Filters/Filters";
import Filter from "./pages/Filters/Filter";

import Messages from "./pages/Messages";
import Login from "./pages/Login/Login";

interface Admin {
    id: number;
    name: string;
    login: string;
}

interface StateProps {
    hasFetchedSession: boolean;
    isLoggedIn: boolean;
}

interface DispatchProps {
    logIn(admin: Admin): void;
    failToLogIn(): void;
}

const mapStateToProps = (state: any): StateProps => {
    return {
        isLoggedIn: state.authReducer.isLoggedIn,
        hasFetchedSession: state.authReducer.hasFetchedSession,
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        logIn: (payload: Admin) =>
            dispatch({ type: actions.LOG_IN, payload: payload }),
        failToLogIn: () => dispatch({ type: actions.FAIL_TO_LOG_IN }),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const App = (props: PropsFromRedux) => {
    const { logIn, failToLogIn, hasFetchedSession, isLoggedIn } = props;

    axios.defaults.baseURL = process.env.REACT_APP_API;
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios("/admin/session/")
            .then((res) => {
                logIn(res.data);
            })
            .catch(() => {
                console.log("FAILED_TO_RETRIEVE_SESSION_DATA");
                failToLogIn();
            });
    }, [logIn, failToLogIn]);

    const getRouter = () => {
        if (!hasFetchedSession) {
            return null;
        }

        if (!isLoggedIn) {
            return (
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            );
        }

        if (isLoggedIn) {
            return (
                <Switch>
                    <Wrapper>
                        <Route exact path="/">
                            <Redirect to="/category_groups" />
                        </Route>
                        <Route
                            exact
                            path="/category_groups"
                            component={CategoryGroups}
                        />
                        <Route
                            exact
                            path="/category_groups/:category_group_id"
                            component={(props: any) => (
                                <CategoryGroup {...props} />
                            )}
                        />

                        <Route
                            exact
                            path="/categories"
                            component={Categories}
                        />
                        <Route
                            exact
                            path="/categories/:category_id"
                            component={(props: any) => <Category {...props} />}
                        />

                        <Route exact path="/filters" component={Filters} />
                        <Route
                            exact
                            path="/filters/:filter_id"
                            component={(props: any) => <Filter {...props} />}
                        />

                        <Route exact path="/products" component={Products} />
                        <Route exact path="/orders" component={Orders} />
                        <Route exact path="/admins" component={Admins} />
                        <Route
                            exact
                            path="/home_slider"
                            component={HomeSlider}
                        />
                        <Route exact path="/messages" component={Messages} />
                    </Wrapper>
                </Switch>
            );
        }
    };

    return getRouter();
};

export default connector(App as any);
