import React from "react";

import "./FilterSection.css";

type FilterSectionProps = {
    active: boolean;
    children: any;
};

const FilterSection = (props: FilterSectionProps) => {
    return (
        <div
            className={`Filter--section ${props.active ? "active" : "hidden"}`}
        >
            {props.children}
        </div>
    );
};

export default FilterSection;
