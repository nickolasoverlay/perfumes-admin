import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const AutoComplete = (props) => {
    const {
        options,
        defaultValue,
        value,
        getOptionLabel,
        getOptionSelected,
        onChange,
        ...params
    } = props;

    if (value) {
        return (
            <div style={{ width: "100%" }}>
                <Autocomplete
                    options={options}
                    value={value}
                    onChange={(e, v) => {
                        if (v) {
                            onChange(v);
                        }
                    }}
                    getOptionLabel={getOptionLabel}
                    getOptionSelected={getOptionSelected}
                    autoHighlight
                    renderInput={(renderParams) => {
                        return (
                            <TextField
                                {...renderParams}
                                {...params}
                                margin="dense"
                                fullWidth
                            />
                        );
                    }}
                />
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            <Autocomplete
                options={options}
                defaultValue={defaultValue}
                onChange={(e, value) => {
                    if (value) {
                        onChange(value);
                    }
                }}
                getOptionLabel={getOptionLabel}
                getOptionSelected={getOptionSelected}
                autoHighlight
                filterSelectedOptions
                renderInput={(renderParams) => (
                    <TextField
                        {...renderParams}
                        {...params}
                        margin="dense"
                        fullWidth
                    />
                )}
            />
        </div>
    );
};

export default AutoComplete;
