import React, { useState } from "react";
import { connect } from "react-redux";

import useCategories from "./../../hooks/useCategories";

import { Button, Typography } from "@material-ui/core";
import Wrapper from "./../../ui/Wrapper";
import Spinner from "./../../ui/Spinner";

import CategoryBlock from "./CategoryBlock";
import AddCategoryDialog from "./AddCategoryDialog";

import "./Categories.css";

const Categories = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const handleDialogClose = () => setOpenDialog(false);

    const { categories, isLoading, isError } = useCategories();

    if (isLoading || isError) {
        return (
            <Wrapper>
                <Spinner />
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <AddCategoryDialog
                isOpen={openDialog}
                onClose={handleDialogClose}
            />

            <div className="ActionBar">
                <div className="ActionBar--title">Категорії</div>
                <div>
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
                {categories.length === 0 && (
                    <Typography variant="h5" className="NoData">
                        Не існує жодної категорії
                    </Typography>
                )}
                {categories.map((category) => (
                    <CategoryBlock key={category.id} {...category} />
                ))}
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
