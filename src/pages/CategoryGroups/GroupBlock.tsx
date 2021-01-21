import React from "react";

import { useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";

import Bubble from "../../ui/Bubble";
import { Group } from "./types";

const GroupBlock = (props: Group) => {
    const history = useHistory();

    const onClick = () => {
        history.push("/category_groups/" + props.id);
    };

    return (
        <Bubble onClick={onClick}>
            <Typography variant="button">
                Назва (EN): <span>{props.name_en}</span>
            </Typography>
            <Typography variant="button">
                Назва (FR): <span>{props.name_fr}</span>
            </Typography>
            <Typography variant="button" className="Bubble--url">
                Посилання: <span className="aqua">{props.url}</span>
            </Typography>
        </Bubble>
    );
};

export default GroupBlock;
