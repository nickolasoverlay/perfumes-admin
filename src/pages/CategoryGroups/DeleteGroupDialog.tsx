import React from "react";
import { useHistory } from "react-router-dom";
import useGroups from "./../../hooks/useGroups";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@material-ui/core";

type DeleteGroupDialogProps = {
    isOpen: boolean;
    groupId: number;
    close(): void;
};

const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = (props) => {
    const { isOpen, groupId, close } = props;

    const history = useHistory();
    const { deleteGroup } = useGroups();

    const onClick = () => {
        deleteGroup(groupId);
        history.push("/category_groups");
    };

    return (
        <Dialog open={isOpen} onClose={close} fullWidth>
            <DialogTitle>Видалення колекції</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Якщо ви видалите цю колекцію, то всі категорії що до неї
                    належали, будуть переміщені в розділ нерозподілених.
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

export default DeleteGroupDialog;
