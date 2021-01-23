import React from "react";
import { useHistory } from "react-router-dom";
import useProducts from "./../../hooks/useProducts";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@material-ui/core";

type DeleteProductDialogProps = {
    isOpen: boolean;
    productId: number;
    close(): void;
};

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = (props) => {
    const { isOpen, productId, close } = props;

    const history = useHistory();
    const { deleteProduct } = useProducts();

    const onClick = () => {
        deleteProduct(productId);
        history.push("/products");
    };

    return (
        <Dialog open={isOpen} onClose={close} fullWidth>
            <DialogTitle>Видалення продукту</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Якщо ви видалите цей продукт, то він буде більше недоступний
                    в каталозі, та для нових замовлень, проте залишиться
                    доступним для вже зроблених замовлень.
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

export default DeleteProductDialog;
