import React from "react";

import { useHistory } from "react-router-dom";

import { Typography } from "@material-ui/core";
import Bubble from "../../ui/Bubble";

import { Category } from "./types";

const CategoryBlock = (category: Category) => {
    const history = useHistory();

    const handleClick = () => {
        history.push("/categories/" + category.id);
    };

    return (
        <Bubble onClick={handleClick}>
            <Typography variant="button">
                Назва (EN): <span>{category.name_en}</span>
            </Typography>
            <Typography variant="button">
                Назва (FR): <span>{category.name_fr}</span>
            </Typography>
            <Typography variant="button">
                Посилання: <span className="aqua">{category.url}</span>
            </Typography>
        </Bubble>
    );
};

export default CategoryBlock;
