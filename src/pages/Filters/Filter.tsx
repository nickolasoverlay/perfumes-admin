import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import useFilter from "../../hooks/useFilter";
import useCategories from "../../hooks/useCategories";

import Wrapper from "./../../ui/Wrapper";
import Spinner from "./../../ui/Spinner";
import Autocomplete from "./../../ui/AutoComplete";
import DialogTextField from "../../ui/DialogTextField";

import { Button } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { Filter } from "./types";
import { Category } from "./../Categories/types";

import DeleteFilterDialog from "./DeleteFilterDialog";

const FilterEditPage = (props: any) => {
    const { control, handleSubmit } = useForm<Filter>();
    const history = useHistory();
    const categoriesFuture = useCategories();
    const { filter, updateFilter, isLoading, isError } = useFilter(
        props.match.params.filter_id
    );

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleCancel = () => {
        history.push("/filters");
    };

    const onSubmit = (updatedFilter: Filter) => {
        updateFilter({
            ...updatedFilter,
            id: filter.id,
        });
        history.push("/filters");
    };

    if (
        isLoading ||
        isError ||
        categoriesFuture.isLoading ||
        categoriesFuture.isError
    ) {
        return (
            <Wrapper>
                <Spinner />
            </Wrapper>
        );
    }

    const defaultCategory = categoriesFuture.categories.find(
        (c: Category) => c.id === filter.category
    );

    return (
        <Wrapper>
            <div className="filter">
                <DeleteFilterDialog
                    isOpen={openDeleteDialog}
                    close={handleCloseDeleteDialog}
                    filterId={filter.id}
                />
                <div className="ActionBar">
                    <div className="ActionBar--title">
                        Фільтри
                        <NavigateNextIcon />
                        {filter.id}
                        <NavigateNextIcon />
                        Редагування
                    </div>
                    <Button
                        color="secondary"
                        variant="contained"
                        disableElevation
                        onClick={handleOpenDeleteDialog}
                    >
                        Видалити
                    </Button>
                </div>
                <div className="filter_edit_form triple_grid_column">
                    <Controller
                        control={control}
                        name="name_en"
                        label="Назва (EN)"
                        defaultValue={filter.name_en}
                        as={DialogTextField}
                    />
                    <Controller
                        control={control}
                        name="name_fr"
                        label="Назва (FR)"
                        defaultValue={filter.name_fr}
                        as={DialogTextField}
                    />
                    <Controller
                        name="category"
                        control={control}
                        defaultValue={defaultCategory ? defaultCategory.id : 0}
                        render={(props) => {
                            return (
                                <Autocomplete
                                    options={categoriesFuture.categories}
                                    defaultValue={defaultCategory}
                                    getOptionLabel={(o: Category) => o.name_en}
                                    label="Категорія"
                                    getOptionSelected={(
                                        option: Category,
                                        value: Category
                                    ) => option.id === value.id}
                                    onChange={(o: Category) => {
                                        props.onChange(o.id);
                                    }}
                                />
                            );
                        }}
                    />
                </div>
                <div className="edit_form_actions">
                    <Button style={{ marginRight: 10 }} onClick={handleCancel}>
                        Відміна
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        onClick={handleSubmit(onSubmit)}
                    >
                        Зберегти
                    </Button>
                </div>
            </div>
        </Wrapper>
    );
};

export default FilterEditPage;
