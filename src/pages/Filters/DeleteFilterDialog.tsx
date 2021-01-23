import React from "react";
import { useHistory } from "react-router-dom";
import useFilters from "./../../hooks/useFilters";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@material-ui/core";

type DeleteFilterDialogProps = {
    isOpen: boolean;
    filterId: number;
    close(): void;
};

const DeleteFilterDialog: React.FC<DeleteFilterDialogProps> = (props) => {
    const { isOpen, filterId, close } = props;

    const history = useHistory();
    const { deleteFilter } = useFilters();

    const onClick = () => {
        deleteFilter(filterId);
        history.push("/filters");
    };

    return (
        <Dialog open={isOpen} onClose={close} fullWidth>
            <DialogTitle>Видалення фільтру</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Якщо ви видалите цей фільтр, то всі товари які до нього
                    належать, будуть помічені як такі що немають фільтру
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

export default DeleteFilterDialog;
