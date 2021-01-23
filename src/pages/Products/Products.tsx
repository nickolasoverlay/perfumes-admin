import React, { useState } from "react";
import useProducts from "../../hooks/useProducts";

import { Button } from "@material-ui/core";

import ProductDialog from "./AddProductDialog";
import ProductBlock from "./ProductBlock";

import "./Products.css";

const Products = () => {
    const { products, isLoading, isError } = useProducts();

    const [openDialog, setOpenDialog] = useState(false);
    const handleDialogClose = () => setOpenDialog(false);
    const handleDialogOpen = () => setOpenDialog(true);

    if (isLoading || isError) {
        return null;
    }

    return (
        <div className="products">
            <ProductDialog isOpen={openDialog} close={handleDialogClose} />
            <div className="ActionBar ProductsActionBar">
                <div className="ActionBar--title">Товари</div>
                <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    onClick={handleDialogOpen}
                >
                    Новий товар
                </Button>
            </div>
            <div className="Products Shell">
                {products.map((p) => (
                    <ProductBlock key={p.id} {...p} />
                ))}
            </div>
        </div>
    );
};

export default Products;
