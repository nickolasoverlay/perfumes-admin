import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment,
} from "@material-ui/core";

import Snackbar from "./../../ui/Snackbar";
import "./HomeSlider.css";

import HomeSliderPreview from "./HomeSliderPreview";

const DialogSlider = ({ dialogPhotos }) => {
    const [curPhoto, setCurPhoto] = useState(0);

    return (
        <>
            {dialogPhotos.length !== 0 && (
                <>
                    <div className="Products--photoslider--photos">
                        <div
                            style={{
                                height: "350px",
                                width: "400px",
                                background: `url('${dialogPhotos[curPhoto].url}')`,
                            }}
                        />
                    </div>
                    <div className="Products--photoslider--indicator">
                        {dialogPhotos.map((_, i) => {
                            return (
                                <div
                                    key={i.toString()}
                                    className={`Products--photoslider--dot${
                                        i === curPhoto ? " current" : ""
                                    }`}
                                    onClick={() => setCurPhoto(i)}
                                ></div>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
};

const HomeSlider = (props) => {
    const { isLoggedIn } = props;

    const [slides, setSlides] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogPhotos, setDialogPhotos] = useState([]);
    const [dialogSection, setDialogSection] = useState(0);

    const [textUA, setTextUA] = useState("");
    const [textRU, setTextRU] = useState("");
    const [url, setURL] = useState("");

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarText, setSnackBarText] = useState("");
    const [snackBarSeverity, setSnackBarSeverity] = useState("");

    useEffect(() => {
        if (isLoggedIn) {
            axios("/home_slider/").then((res) => {
                setSlides(res.data);
            });
        }
    }, [isLoggedIn]);

    const handleTextUA = (e) => {
        if (e.target.value.length <= 64) {
            setTextUA(e.target.value);
        }
    };

    const handleTextRU = (e) => {
        if (e.target.value.length <= 64) {
            setTextRU(e.target.value);
        }
    };

    const handleURL = (e) => {
        if (e.target.value.length <= 64) {
            setURL(e.target.value);
        }
    };

    const dialogPhotosChange = (e) => {
        let files = [];

        for (let i = 0; i < e.currentTarget.files.length; i++) {
            let f = e.currentTarget.files[i];
            let url = URL.createObjectURL(f);

            files.push({ url: url, file: f });
        }

        setDialogPhotos((f) => f.concat(...files));
    };

    const isValid =
        dialogSection === 0
            ? textUA !== "" && textRU !== "" && url !== ""
            : dialogPhotos.length !== 0;

    const handleDialogClose = () => {
        setDialogOpen(false);
        setDialogSection(0);
        setDialogPhotos([]);
        setTextUA("");
        setTextRU("");
        setURL("");
    };

    const handleSubmit = () => {
        console.log("[SUBMIT]: ", url, textUA, textRU, dialogPhotos[0]);

        const data = new FormData();

        data.append("url", url);
        data.append("textUA", textUA);
        data.append("textRU", textRU);
        data.append("picture", dialogPhotos[0].file);

        axios
            .post("/admin/home_slider/add/", data)
            .then((res) => {
                setSlides([...slides, res.data]);

                setSnackBarSeverity("success");
                setSnackBarText("Пропозиція успішно добавлена");
            })
            .catch((err) => {
                console.log("ERR: ", err);

                setSnackBarSeverity("error");
                setSnackBarText("Не вдалося добавити пропозицію");
            })
            .finally(() => {
                handleDialogClose();
                setSnackBarOpen(true);
            });
    };

    const dialog = (
        <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
            <DialogTitle>Добавлення нової пропозиції</DialogTitle>

            <DialogContent>
                {dialogSection === 0 && (
                    <>
                        <TextField
                            label={`Текст (UA): ${textUA.length} / 64`}
                            onChange={handleTextUA}
                            fullWidth
                        ></TextField>
                        <TextField
                            label={`Текст (RU): ${textRU.length} / 64`}
                            onChange={handleTextRU}
                            fullWidth
                        ></TextField>
                        <TextField
                            label={`URL (${url.length} / 64)`}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment>
                                        https://test.yva.com.ua/collections/
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handleURL}
                            fullWidth
                        ></TextField>
                    </>
                )}
                {dialogSection === 1 && (
                    <>
                        <input
                            type="file"
                            onChange={(e) => dialogPhotosChange(e)}
                            id="p-file"
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                        <div className="Products--photoslider">
                            <DialogSlider dialogPhotos={dialogPhotos} />
                            {dialogPhotos.length === 0 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                >
                                    <label htmlFor="p-file">Вибрати фото</label>
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    variant="text"
                    color="primary"
                    onClick={handleDialogClose}
                >
                    Відміна
                </Button>

                {dialogSection === 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setDialogSection(1)}
                        disableElevation
                        disabled={!isValid}
                    >
                        Вибрати фотографію
                    </Button>
                )}
                {dialogSection === 1 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disableElevation
                        disabled={!isValid}
                    >
                        Добавити
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );

    const onDelete = (id) => {
        setSlides((s) => s.filter((slide) => slide.id !== id));
    };

    return (
        <div className="home_slider">
            {dialog}

            <Snackbar
                severity={snackBarSeverity}
                message={snackBarText}
                open={snackBarOpen}
                onClose={() => setSnackBarOpen(false)}
            />

            <div className="ActionBar">
                <div className="ActionBar--title">Слайдер пропозицій</div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setDialogOpen(true)}
                    disableElevation
                >
                    Добавити пропозицію
                </Button>
            </div>

            <div className="HomeSlider">
                <HomeSliderPreview slides={slides} onDelete={onDelete} />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authReducer.isLoggedIn,
    };
};

export default connect(mapStateToProps)(HomeSlider);
