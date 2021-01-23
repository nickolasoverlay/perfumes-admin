import React, { useState } from "react";

import axios from "axios";
import useGroups from "./../../hooks/useGroups";

import { Typography, Button } from "@material-ui/core";

import GroupBlock from "./GroupBlock";
import AddGroupDialog from "./AddGroupDialog";

import Snackbar from "./../../ui/Snackbar";

import "./CategoryGroups.css";

const CategoryGroups = (props) => {
    const { groups, pushGroup, isLoading, isError } = useGroups();

    const [openDialog, setOpenDialog] = useState(false);

    // Snackbar stuff
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const closeSnackbar = () => setSnackbarOpen(false);

    if (isLoading || isError) {
        return null;
    }

    const deleteGroup = (id) => {
        const data = new FormData();

        data.append("id", id);

        axios
            .post("/admin/category_groups/delete/", data)
            .then((res) => {
                setSnackbarSeverity("success");
                setSnackbarMessage("Колекція успішно видалена");
                setSnackbarOpen(true);

                // setGroups(groups.filter((group) => group.id !== id));
            })
            .catch((err) => {
                setSnackbarSeverity("error");
                setSnackbarMessage("Не вдалося видалити колекцію");
                setSnackbarOpen(true);
            });
    };

    return (
        <div className="category_groups">
            <AddGroupDialog
                onClose={() => setOpenDialog(false)}
                isOpen={openDialog}
                pushGroup={pushGroup}
            />
            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={closeSnackbar}
            />
            <div className="ActionBar">
                <div className="ActionBar--title">Колекції</div>
                <Button
                    onClick={() => setOpenDialog(true)}
                    color="primary"
                    variant="contained"
                    disableElevation
                >
                    Нова колекція
                </Button>
            </div>
            <div className="CategoryGroups Shell">
                {groups.length === 0 && (
                    <Typography variant="h5" className="NoData">
                        Не існує жодної колекції
                    </Typography>
                )}
                {groups.map((group, index) => {
                    return (
                        <GroupBlock
                            {...group}
                            delete={() => deleteGroup(group.id)}
                            key={group.id}
                            index={index}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryGroups;
