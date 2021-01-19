import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Typography,
  Badge,
  MenuItem,
} from "@material-ui/core";

import Wrapper from "./../../ui/Wrapper";
import Menu from "./../../ui/Menu";
import Snackbar from "./../../ui/Snackbar";

import CategoryBlock from "./CategoryBlock"

import "./Categories.css";

const Categories = (props) => {
  const { isLoggedIn } = props;

  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  // Snackbar stuff
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const closeSnackbar = () => setSnackbarOpen(true);

  // Group stuff
  const [groupAnchor, setGroupAnchor] = useState(null);
  const [groupIndex, setGroupIndex] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      axios("/admin/category_groups/").then((res) => {
        console.log("AVAILABLE_CATEGORIES: ", res.data);
        setGroups(res.data);
      });

      axios("/admin/categories/").then((res) => {
        console.log("AVAILABLE_CATEGORIES: ", res.data);
        setCategories(res.data);
      });
    }
  }, [isLoggedIn]);

  const deleteCategory = (id) => {
    const data = new FormData();

    data.append("id", id);

    axios
      .post("/admin/categories/delete/", data)
      .then((res) => {
        setSnackbarSeverity("success");
        setSnackbarMessage("Категорія успішно видалена");
        setSnackbarOpen(true);

        setCategories(categories.filter((category) => category.id !== id));
      })
      .catch((err) => {
        setSnackbarSeverity("error");
        setSnackbarMessage("Не вдалось видалити категорію");
        setSnackbarOpen(true);
      });
  };


  const categoriesInGroup = (groupIndex) => {
    const q = categories.filter(
      (category) => category.group_id === groups[groupIndex].id
    ).length;

    return q;
  };

  return (
    <Wrapper>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
      <div className="ActionBar">
        <div className="ActionBar--title">Категорії</div>
        <div>
          {groups && groups.length !== 0 && (
            <>
              <Button
                onClick={(e) => setGroupAnchor(e.target)}
                color="primary"
                variant="contained"
                disableElevation
              >
                Колекція: {groups[groupIndex].name_ua}
                <Badge
                  color="secondary"
                  badgeContent={categoriesInGroup(groupIndex)}
                ></Badge>
              </Button>
              <Menu
                anchorEl={groupAnchor}
                open={Boolean(groupAnchor)}
                onClose={() => setGroupAnchor(null)}
              >
                {groups.map((group, index) => {
                  return (
                    <MenuItem
                      key={group.id}
                      onClick={() => {
                        setGroupIndex(index);
                        setGroupAnchor(null);
                      }}
                    >
                      Колекція: {group.name_ua}
                      <Badge
                        color="secondary"
                        badgeContent={categoriesInGroup(index)}
                      ></Badge>
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          )}
          <Button
            onClick={() => setOpenDialog(true)}
            color="primary"
            variant="contained"
            disableElevation
            style={{ marginLeft: "15px" }}
          >
            Нова категорія
          </Button>
        </div>
      </div>
      <div className="Categories Shell">
        {groups.length === 0 && (
          <Typography variant="h5" className="NoData">
            Потрібно створити хоча б одну колекцію
          </Typography>
        )}
        {categories.length === 0 && groups.length !== 0 && (
          <Typography variant="h5" className="NoData">
            Не існує жодної категорії
          </Typography>
        )}
        {categories
          .filter((category) => category.group_id === groups[groupIndex].id)
          .map((category, index) => {
            return (
              <CategoryBlock
                {...category}
                groups={groups}
                delete={() => deleteCategory(category.id)}
                key={category.id}
                index={index}
              />
            );
          })}
      </div>
    </Wrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    authState: state.authReducer,
    isLoggedIn: state.authReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps)(Categories);
