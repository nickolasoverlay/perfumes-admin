import React from "react";
import { useHistory } from "react-router-dom";

import { Typography } from "@material-ui/core";
import Bubble from "./../../ui/Bubble";

import { Filter } from "./types";

const FilterBlock = (filter: Filter) => {
    const history = useHistory();

    const onClick = () => {
        history.push("/filters/" + filter.id);
    };

    return (
        <Bubble onClick={onClick}>
            <Typography variant="button">
                Назва (EN): <span>{filter.name_en}</span>
            </Typography>
            <Typography variant="button">
                Назва (FR): <span>{filter.name_fr}</span>
            </Typography>
        </Bubble>
    );
};

export default FilterBlock;
