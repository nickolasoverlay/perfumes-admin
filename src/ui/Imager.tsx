import React, { useState, useRef } from "react";
import { IconButton, Typography, Tooltip } from "@material-ui/core";
import { Close, Add, NavigateBefore, NavigateNext } from "@material-ui/icons";
import "./Imager.css";

type ImagerProps = {
    presentImages?: string;
    entity: "category_group" | "home_slide" | "product";
    entityId: number | string;
    onEditCommit(images: string): void;
};

type ImagerAction = "add" | "delete";

const Imager: React.FC<ImagerProps> = (props) => {
    const { entity, presentImages = "", entityId, onEditCommit } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [images, setImages] = useState(
        presentImages.split(",").filter((s) => s !== "")
    );
    const [action, setAction] = useState<ImagerAction>("add");

    const handleAddChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const data: FormData = new FormData();
        data.append("quantity", e.target.files.length.toString());

        for (let i = 0; i < e.target.files.length; i++) {
            data.append(`photo_${i}`, e.target.files[i]);
        }

        const addProcessed = await fetch(
            `${process.env.REACT_APP_API}/admin/imager/?id=${entityId}&entity=${entity}&action=${action}`,
            {
                method: "POST",
                body: data,
                credentials: "include",
            }
        ).then((res) => res.json());

        if (inputRef.current) {
            inputRef.current.value = "";
        }
        setImages(
            addProcessed.pictures.split(",").filter((s: string) => s !== "")
        );
    };

    const handleLeftControl = () => {
        if (photoIndex === 0) {
            setPhotoIndex(images.length - 1);
        } else {
            setPhotoIndex((i) => i - 1);
        }
    };

    const handleRightControl = () => {
        if (photoIndex === images.length - 1) {
            setPhotoIndex(0);
        } else {
            setPhotoIndex((i) => i + 1);
        }
    };

    return (
        <div className="Imager">
            <input
                type="file"
                multiple={entity === "product"}
                onChange={handleAddChange}
                id="p-file"
                accept="image/*"
                ref={inputRef}
                style={{ display: "none" }}
            />

            <div className="Imager--actions">
                <Typography variant="button">Зображення</Typography>
                <div>
                    <Tooltip title="Добавити фото">
                        <IconButton>
                            <label
                                htmlFor="p-file"
                                style={{ display: "flex", cursor: "pointer" }}
                            >
                                <Add />
                            </label>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className="Imager--photos">
                {entity === "product" && (
                    <div className="Imager--control Imager--left">
                        <IconButton onClick={handleLeftControl}>
                            <NavigateBefore />
                        </IconButton>
                    </div>
                )}
                <img
                    className="Imager--photo"
                    src={
                        `${process.env.REACT_APP_API}/media/` +
                        images[photoIndex]
                    }
                    alt=""
                />
                {entity === "product" && (
                    <div className="Imager--control Imager--right">
                        <IconButton onClick={handleRightControl}>
                            <NavigateNext />
                        </IconButton>
                    </div>
                )}
            </div>
            <div className="Imager--dots">
                {entity === "product" &&
                    images.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => setPhotoIndex(index)}
                            className={
                                index === photoIndex
                                    ? "Imager--dot active"
                                    : "Imager--dot"
                            }
                        />
                    ))}
            </div>
        </div>
    );
};

export default Imager;
