import React, { useState } from "react";
import { connect } from "react-redux";

import useGroups from "./../../hooks/useGroups";
import useCategories from "./../../hooks/useCategories";

import { Button, Typography } from "@material-ui/core";

import Spinner from "./../../ui/Spinner";
import FilterChip from "./../../ui/FilterChip";
import FilterSection from "./../../ui/FilterSection";

import CategoryBlock from "./CategoryBlock";
import AddCategoryDialog from "./AddCategoryDialog";

import "./Categories.css";

const Categories = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const handleDialogClose = () => setOpenDialog(false);

    const [openFilters, setOpenFilters] = useState(false);
    const handleOpenFiltersClick = () => setOpenFilters((o) => !o);

    const { groups } = useGroups();
    const { categories, isLoading, isError } = useCategories();

    // Support filtering by groups
    const [filterGroups, setFilterGroups] = useState([]);
    const handlePushGroupFilter = (id) =>
        setFilterGroups([...filterGroups, id]);
    const handleDeleteGroupFilter = (id) => {
        setFilterGroups(filterGroups.filter((g) => g !== id));
    };
    const checkGroupFilter = (id) => {
        return filterGroups.indexOf(id) !== -1;
    };

    const filterFunc = (products) => {
        if (filterGroups.length === 0) {
            return products;
        } else {
            return products.filter(
                (p) => filterGroups.indexOf(p.group_id) !== -1
            );
        }
    };

    if (isLoading || isError) {
        return (
            <div className="categories">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="categories">
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
                    <Button
                        onClick={handleOpenFiltersClick}
                        variant="contained"
                        disableElevation
                        style={{ marginLeft: "15px" }}
                    >
                        {openFilters ? "Сховати фільтри" : "Показати фільтри"}
                    </Button>
                </div>
            </div>

            <FilterSection active={openFilters}>
                <div className="Filter--variants">
                    <Typography
                        variant="button"
                        style={{ marginBottom: 10, display: "block" }}
                    >
                        Колекції
                    </Typography>
                    <div className="Filter--variants--list">
                        {groups &&
                            groups.map((group) => (
                                <FilterChip
                                    label={group.name_en}
                                    key={group.id}
                                    active={checkGroupFilter(group.id)}
                                    onActivate={() =>
                                        handlePushGroupFilter(group.id)
                                    }
                                    onDeactivate={() =>
                                        handleDeleteGroupFilter(group.id)
                                    }
                                />
                            ))}
                    </div>
                </div>
            </FilterSection>

            <div className="Categories Shell">
                {categories.length === 0 && (
                    <Typography variant="h5" className="NoData">
                        Не існує жодної категорії
                    </Typography>
                )}
                {filterFunc(categories).map((category) => (
                    <CategoryBlock key={category.id} {...category} />
                ))}
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

export default connect(mapStateToProps)(Categories);
