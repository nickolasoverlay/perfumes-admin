import React from "react";
import { Button, Chip } from "@material-ui/core";

import "./FilterChip.css";

type FilterChipProps = {
    active: boolean;
    onActivate: (e: any) => void;
    onDeactivate: (e: any) => void;
    label: string;
};

const FilterChip = (props: FilterChipProps) => {
    return (
        <Button
            className={
                props.active
                    ? "FilterChip FilterChip--primary"
                    : "FilterChip FilterChip--default"
            }
            disableRipple
            disableElevation
            onClick={props.active ? props.onDeactivate : props.onActivate}
        >
            {props.label}
        </Button>
    );
};

export default FilterChip;
