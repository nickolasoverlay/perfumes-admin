import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Bubble from "./../../ui/Bubble";
import Menu from "./../../ui/Menu";
import { Button, IconButton, Typography, MenuItem } from "@material-ui/core";
import { ExpandMore, ExpandLess, MoreVert } from "@material-ui/icons";
import "./Admins.css";

const AdminBlock = (props) => {
    const { name, authState } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);
    const [blockAnchor, setBlockAnchor] = useState(null);

    return (
        <Bubble>
            {isEditing === true ? (
                <></>
            ) : (
                <>
                    <div className="Bubble--menu">
                        <IconButton
                            onClick={(e) => setBlockAnchor(e.currentTarget)}
                        >
                            <MoreVert />
                        </IconButton>
                        <Menu
                            anchorEl={blockAnchor}
                            open={Boolean(blockAnchor)}
                            onClose={() => setBlockAnchor(null)}
                        >
                            <MenuItem
                                onClick={() => {
                                    setIsEditing(true);
                                    setBlockAnchor(null);
                                }}
                            >
                                Редагувати
                            </MenuItem>
                            <MenuItem className="red">Видалити</MenuItem>
                        </Menu>
                    </div>
                    <Typography variant="button">
                        Ім'я: <span className="gray">{name}</span>
                    </Typography>
                    {authState.isRoot && (
                        <>
                            <Typography variant="button">
                                Логін: <span className="gray">{name}</span>
                            </Typography>
                            {showPermissions && (
                                <div className="Permissions"></div>
                            )}
                            <div className="Toggle">
                                <IconButton
                                    onClick={() =>
                                        setShowPermissions(!showPermissions)
                                    }
                                >
                                    {showPermissions ? (
                                        <ExpandLess />
                                    ) : (
                                        <ExpandMore />
                                    )}
                                </IconButton>
                            </div>
                        </>
                    )}
                </>
            )}
        </Bubble>
    );
};

const Admins = (props) => {
    const { isLoggedIn } = props;
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            axios("/admin/admins/")
                .then((res) => {
                    console.log("ADMINS: ", res.data);
                    setAdmins(res.data);
                })
                .catch((err) => {
                    console.log("ADMINS_ERR: ", err.config);
                });
        }
    }, [isLoggedIn]);

    return (
        <div className="admins">
            <div className="ActionBar">
                <div className="ActionBar--title">Адміністратори</div>
                {props.authState.canDeleteAdmins && (
                    <Button
                        color="primary"
                        variant="contained"
                        disableElevation
                    >
                        Добавити адміністратора
                    </Button>
                )}
            </div>
            <div className="Admins Shell">
                {admins.map((admin) => {
                    return (
                        <AdminBlock
                            key={admin.id}
                            {...admin}
                            authState={props.authState}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        authState: state.authReducer,
        isLoggedIn: state.authReducer.isLoggedIn,
    };
};

export default connect(mapStateToProps)(Admins);
