import React from "react";
import { useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import useGroup from "./../../hooks/useGroup";

import { Button } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import DialogTextField from "../../ui/DialogTextField";
import Autocomplete from "../../ui/AutoComplete";

import Spinner from "./../../ui/Spinner";
import Wrapper from "./../../ui/Wrapper";

import { Group, TypeOption, typeList } from "./types";

const CategoryGroup = (props: any) => {
    const { group, updateGroup, isLoading, isError } = useGroup(
        props.match.params.category_group_id
    );
    const { control, handleSubmit } = useForm<Group>();
    const history = useHistory();

    if (isLoading || isError) {
        return (
            <Wrapper>
                <Spinner />
            </Wrapper>
        );
    }

    const handleCancel = () => {
        history.push("/category_groups");
    };

    const onSubmit = (updatedGroup: Group) => {
        updateGroup({
            ...updatedGroup,
            id: group.id,
        });
        history.push("/category_groups");
    };

    return (
        <Wrapper>
            <div className="category_group">
                <div className="ActionBar">
                    <div className="ActionBar--title">
                        Колекції
                        <NavigateNextIcon />
                        {group.id}
                        <NavigateNextIcon />
                        Редагування
                    </div>
                </div>
                <div className="category_group_form triple_grid_column">
                    <Controller
                        name="name_en"
                        control={control}
                        label="Назва (EN)"
                        defaultValue={group.name_en}
                        as={DialogTextField}
                    />
                    <Controller
                        name="name_fr"
                        control={control}
                        defaultValue={group.name_fr}
                        label="Назва (FR)"
                        as={<DialogTextField />}
                    />
                    <Controller
                        name="type"
                        control={control}
                        defaultValue={typeList[group.type - 1].value}
                        render={(props) => {
                            return (
                                <Autocomplete
                                    options={typeList}
                                    defaultValue={typeList[group.type - 1]}
                                    getOptionLabel={(o: TypeOption) => o.name}
                                    getOptionSelected={(
                                        option: TypeOption,
                                        value: TypeOption
                                    ) => option.value === value.value}
                                    onChange={(o: TypeOption) => {
                                        props.onChange(o.value);
                                    }}
                                />
                            );
                        }}
                    />
                    <Controller
                        name="url"
                        control={control}
                        defaultValue={group.url}
                        label="Посилання"
                        as={<DialogTextField />}
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

export default CategoryGroup;
