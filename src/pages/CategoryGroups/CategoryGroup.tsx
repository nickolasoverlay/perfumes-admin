import React from "react";
import useGroup from "./../../hooks/useGroup";

import Spinner from "./../../ui/Spinner";
import Wrapper from "./../../ui/Wrapper";

const CategoryGroup = (props: any) => {
    const { group, isLoading, isError } = useGroup(
        props.match.params.category_group_id
    );

    if (isLoading || isError) {
        return (
            <Wrapper>
                <Spinner />
            </Wrapper>
        );
    }

    return <Wrapper>{JSON.stringify(group)}</Wrapper>;
};

export default CategoryGroup;
