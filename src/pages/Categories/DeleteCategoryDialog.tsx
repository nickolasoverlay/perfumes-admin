import React from "react";
import { useHistory } from "react-router-dom";
import useCategories from "./../../hooks/useCategories";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@material-ui/core";

type DeleteCategoryDialogProps = {
    isOpen: boolean;
    categoryId: number;
    close(): void;
};

const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = (props) => {
    const { isOpen, categoryId, close } = props;

    const history = useHistory();
    const { deleteCategory } = useCategories();

    const onClick = () => {
        deleteCategory(categoryId);
        history.push("/categories");
    };

    return (
        <Dialog open={isOpen} onClose={close} fullWidth>
            <DialogTitle>Видалення категорії</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Якщо ви видалите цю категорію, то всі товари та фільтри що
                    до неї належали, будуть переміщені в розділ нерозподілених.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Відміна</Button>
                <Button
                    color="secondary"
                    onClick={onClick}
                    variant="contained"
                    disableElevation
                >
                    Видалити
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteCategoryDialog;
