import React, { useState } from "react";

import usePost from "./../../hooks/usePost";
import usePosts from "./../../hooks/usePosts";

import { Button } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import Spinner from "./../../ui/Spinner";

import DeletePostDialog from "./DeletePostDialog";

const Post = (props: any) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const { post, isError, isLoading } = usePost(props.match.params.post_id);

    if (isError || isLoading) {
        return (
            <div className="post">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="post">
            <DeletePostDialog
                postId={post.id}
                isOpen={openDeleteDialog}
                close={handleCloseDeleteDialog}
            />
            <div className="ActionBar">
                <div className="ActionBar--title">
                    Блог <NavigateNextIcon /> Пости <NavigateNextIcon />{" "}
                    {post.id} <NavigateNextIcon /> Редагування
                </div>
                <div>
                    <Button
                        onClick={handleOpenDeleteDialog}
                        color="secondary"
                        variant="contained"
                        disableElevation
                    >
                        Видалити пост
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Post;
