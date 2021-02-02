import React, { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import usePost from "./../../hooks/usePost";
import { Post } from "./types";

import { Button, FormControlLabel, Switch } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import Spinner from "./../../ui/Spinner";
import DialogTextField from "./../../ui/DialogTextField";
import Imager from "./../../ui/Imager";

import DeletePostDialog from "./DeletePostDialog";

const PostEditPage = (props: any) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const history = useHistory();
    const { control, handleSubmit } = useForm();
    const {
        post,
        updatePost,
        updatePostWallpaper,
        isError,
        isLoading,
    } = usePost(props.match.params.post_id);

    const handleCancel = () => {
        history.push("/blog");
    };

    const onSubmit = (updatedPost: Post) => {
        updatePost({
            ...updatedPost,
            id: post.id,
            wallpaper: post.wallpaper,
            created_at: post.created_at,
            likes: post.likes,
        });
        history.push("/blog");
    };

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
                <Button
                    onClick={handleOpenDeleteDialog}
                    color="secondary"
                    variant="contained"
                    disableElevation
                >
                    Видалити пост
                </Button>
            </div>
            <div style={{ marginBottom: 50 }}>
                <Imager
                    entity="post_wallpaper"
                    entityId={props.match.params.post_id}
                    onEditCommit={updatePostWallpaper}
                    presentImages={post.wallpaper}
                    title="Обкладинка поста"
                />
            </div>
            <div className="post_edit_form triple_grid_column">
                <Controller
                    name="title_en"
                    control={control}
                    defaultValue={post.title_en}
                    label="Назва (EN)"
                    as={DialogTextField}
                />
                <Controller
                    name="title_fr"
                    control={control}
                    defaultValue={post.title_fr}
                    label="Назва (FR)"
                    as={DialogTextField}
                />
                <Controller
                    name="short_en"
                    control={control}
                    defaultValue={post.short_en}
                    label="Підзаголовок (EN)"
                    as={DialogTextField}
                />
                <Controller
                    name="short_fr"
                    control={control}
                    defaultValue={post.short_fr}
                    label="Підзаголовок (FR)"
                    as={DialogTextField}
                />
            </div>
            <div
                className="post_edit_text"
                style={{ marginTop: 20, marginBottom: 20 }}
            >
                <Controller
                    name="text_en"
                    control={control}
                    defaultValue={post.text_en}
                    label="Текст (EN)"
                    as={<DialogTextField multiline />}
                />
                <Controller
                    name="text_fr"
                    control={control}
                    defaultValue={post.text_fr}
                    label="Текст (FR)"
                    as={<DialogTextField multiline style={{ marginTop: 15 }} />}
                />
            </div>
            <div className="post_edit_publish">
                <Controller
                    control={control}
                    name="published"
                    defaultValue={post.published}
                    render={(props) => {
                        return (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={props.value}
                                        color="primary"
                                        onChange={(e) =>
                                            props.onChange(e.target.checked)
                                        }
                                        name="published"
                                    />
                                }
                                label={
                                    props.value
                                        ? "Пост опублікований"
                                        : "Пост не опублікований"
                                }
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
    );
};

export default PostEditPage;
