import React from "react";
import { useHistory } from "react-router-dom";
import usePosts from "./../../hooks/usePosts";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@material-ui/core";

type DeletePostDialogProps = {
    close(): void;
    postId: number;
    isOpen: boolean;
};

const DeletePostDialog: React.FC<DeletePostDialogProps> = (props) => {
    const { close, postId, isOpen } = props;

    const history = useHistory();
    const { deletePost } = usePosts();

    const onClick = () => {
        deletePost(postId);
        history.push("/blog");
    };

    return (
        <Dialog open={isOpen} onClose={close} fullWidth>
            <DialogTitle>Ви точно хочете видалити цей пост?</DialogTitle>
            <DialogContent>
                Якщо ви видалите цей пост, то він буде більше недоступний для
                перегляду користувачами сайту
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Відміна</Button>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onClick}
                    disableElevation
                >
                    Видалити
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePostDialog;
