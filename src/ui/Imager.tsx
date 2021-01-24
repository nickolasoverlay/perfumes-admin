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

const Imager: React.FC<ImagerProps> = (props) => {
    const { entity, presentImages = "", entityId } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [images, setImages] = useState(
        presentImages.split(",").filter((s) => s !== "")
    );

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
            `${process.env.REACT_APP_API}/admin/imager/?id=${entityId}&entity=${entity}&action=add`,
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

    const handleRemove = async () => {
        const deleteProcessed = await fetch(
            `${process.env.REACT_APP_API}/admin/imager/?id=${entityId}&entity=${entity}&action=remove&remove=${images[imageIndex]}`,
            {
                method: "POST",
                credentials: "include",
            }
        ).then((res) => res.json());

        setImages(
            deleteProcessed.pictures.split(",").filter((s: string) => s !== "")
        );
        setImageIndex(0);
    };

    const handleLeftControl = () => {
        if (imageIndex === 0) {
            setImageIndex(images.length - 1);
        } else {
            setImageIndex((i) => i - 1);
        }
    };

    const handleRightControl = () => {
        if (imageIndex === images.length - 1) {
            setImageIndex(0);
        } else {
            setImageIndex((i) => i + 1);
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
                    {images.length > 0 && (
                        <Tooltip title="Видалити це фото">
                            <IconButton onClick={handleRemove}>
                                <Close />
                            </IconButton>
                        </Tooltip>
                    )}
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
                {images.length > 0 && (
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
                        images[imageIndex]
                    }
                    alt=""
                />
                {images.length > 0 && (
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
                            onClick={() => setImageIndex(index)}
                            className={
                                index === imageIndex
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
