import React from "react";

import { useHistory } from "react-router-dom";

import { Typography } from "@material-ui/core";
import Bubble from "./../../ui/Bubble";

import { Product } from "./types";

const ProductBlock = (product: Product) => {
    const history = useHistory();

    const onClick = () => {
        history.push("/products/" + product.id);
    };

    return (
        <Bubble onClick={onClick}>
            <Typography variant="button">
                Назва (EN): <span>{product.name_en}</span>
            </Typography>
            <Typography variant="button">
                Назва (FR): <span>{product.name_fr}</span>
            </Typography>
        </Bubble>
    );
};

export default ProductBlock;
