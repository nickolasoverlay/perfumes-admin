import React from "react";
import { useHistory } from "react-router-dom";

import { Typography } from "@material-ui/core";
import Bubble from "./../../ui/Bubble";

import { Post } from "./types";

const PostBlock = (post: Post) => {
    const history = useHistory();

    const onClick = () => {
        history.push("/blog/" + post.id);
    };

    return (
        <Bubble onClick={onClick}>
            <Typography variant="button">
                Назва (EN): <span>{post.title_en}</span>
            </Typography>
            <Typography variant="button">
                Назва (FR): <span>{post.title_fr}</span>
            </Typography>
        </Bubble>
    );
};

export default PostBlock;
