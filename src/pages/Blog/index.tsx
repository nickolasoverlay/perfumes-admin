import React, { useState } from "react";
import usePosts from "./../../hooks/usePosts";

import { Button } from "@material-ui/core";
import Spinner from "./../../ui/Spinner";

import AddPostDialog from "./AddPostDialog";
import PostBlock from "./PostBlock";

const Blog = () => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const { posts, pushPost, deletePost, isLoading, isError } = usePosts();

    if (isLoading || isError) {
        return (
            <div className="categories">
                <Spinner />
            </div>
        );
    }

    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);

    return (
        <div className="categories">
            <AddPostDialog
                close={handleCloseAddDialog}
                isOpen={openAddDialog}
            />
            <div className="ActionBar">
                <div className="ActionBar--title">Блог</div>
                <div>
                    <Button
                        onClick={handleOpenAddDialog}
                        color="primary"
                        variant="contained"
                        disableElevation
                        style={{ marginLeft: "15px" }}
                    >
                        Новий пост
                    </Button>
                </div>
            </div>
            <div className="Shell">
                {posts.map((post) => (
                    <PostBlock key={post.id} {...post} />
                ))}
            </div>
        </div>
    );
};

export default Blog;
