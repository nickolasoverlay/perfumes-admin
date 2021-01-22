import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const AutoComplete = (props) => {
    const {
        options,
        defaultValue,
        getOptionLabel,
        getOptionSelected,
        onChange,
        ...params
    } = props;

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
