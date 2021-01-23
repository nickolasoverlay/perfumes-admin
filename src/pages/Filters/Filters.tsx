import React, { useState } from "react";
import useFilters from "./../../hooks/useFilters";

import { Button } from "@material-ui/core";

import FilterBlock from "./FilterBlock";
import AddFilterDialog from "./AddFilterDialog";

import { Filter } from "./types";
import "./Filters.css";

const Filters = () => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const { filters, isError, isLoading } = useFilters();

    if (isLoading || isError) {
        return null;
    }

    return (
        <div className="filters">
            <div className="ActionBar">
                <div className="ActionBar--title">Фільтри</div>
                <div>
                    <Button
                        onClick={handleOpenDialog}
                        color="primary"
                        variant="contained"
                        disableElevation
                    >
                        Новий фільтр
                    </Button>
                </div>
            </div>
            <div className="Filters">
                <AddFilterDialog
                    isOpen={openDialog}
                    close={handleCloseDialog}
                />
                {filters.map((filter: Filter) => (
                    <FilterBlock key={filter.id} {...filter} />
                ))}
            </div>
        </div>
    );
};

export default Filters;
