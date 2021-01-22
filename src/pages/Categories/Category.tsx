import React from "react";

import { useHistory } from "react-router-dom";
import useCategory from "../../hooks/useCategory";
import useGroups from "../../hooks/useGroups";
import { useForm, Controller } from "react-hook-form";

import Wrapper from "./../../ui/Wrapper";
import Spinner from "./../../ui/Spinner";
import Autocomplete from "./../../ui/AutoComplete";

import { Button } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import DialogTextField from "../../ui/DialogTextField";

import { Category } from "./types";
import { Group } from "./../CategoryGroups/types";

const CategoryPage = (props: any) => {
    const { control, handleSubmit } = useForm<Category>();
    const history = useHistory();
    const groupsFuture = useGroups();
    const { category, updateCategory, isLoading, isError } = useCategory(
        props.match.params.category_id
    );

    const handleCancel = () => {
        history.push("/categories");
    };

    const onSubmit = (updatedCategory: Category) => {
        updateCategory({
            ...updatedCategory,
            id: category.id,
        });
        history.push("/categories");
    };

    if (
        isLoading ||
        isError ||
        groupsFuture.isLoading ||
        groupsFuture.isError
    ) {
        return (
            <Wrapper>
                <Spinner />
            </Wrapper>
        );
    }

    const defaultGroup = groupsFuture.groups.find(
        (g: Group) => g.id === category.group_id
    );

    return (
        <Wrapper>
            <div className="category">
                <div className="ActionBar">
                    <div className="ActionBar--title">
                        Категорії
                        <NavigateNextIcon />
                        {category.id}
                        <NavigateNextIcon />
                        Редагування
                    </div>
                </div>
                <div className="category_edit_form triple_grid_column">
                    <Controller
                        name="name_en"
                        control={control}
                        defaultValue={category.name_en}
                        label="Назва (EN)"
                        as={DialogTextField}
                    />
                    <Controller
                        name="name_fr"
                        control={control}
                        defaultValue={category.name_fr}
                        label="Назва (FR)"
                        as={DialogTextField}
                    />
                    <Controller
                        name="short_en"
                        control={control}
                        defaultValue={category.short_en}
                        label="Підзаголовок (EN)"
                        as={DialogTextField}
                    />
                    <Controller
                        name="short_fr"
                        control={control}
                        defaultValue={category.short_fr}
                        label="Підзаголовок (FR)"
                        as={DialogTextField}
                    />
                    <Controller
                        name="url"
                        control={control}
                        defaultValue={category.url}
                        label="Посилання"
                        as={DialogTextField}
                    />
                    <Controller
                        name="group_id"
                        control={control}
                        defaultValue={defaultGroup.id}
                        render={(props) => {
                            return (
                                <Autocomplete
                                    options={groupsFuture.groups}
                                    defaultValue={defaultGroup}
                                    getOptionLabel={(o: Group) => o.name_en}
                                    label="Колекція"
                                    getOptionSelected={(
                                        option: Group,
                                        value: Group
                                    ) => option.id === value.id}
                                    onChange={(o: Group) => {
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

export default CategoryPage;
