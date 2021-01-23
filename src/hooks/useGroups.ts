import useSWR from "swr";
import fetcher from "./fetcher";

import { Group } from "./../pages/CategoryGroups/types";

const useGroups = () => {
    const { data, mutate, error } = useSWR<Group[]>(
        `${process.env.REACT_APP_API}/admin/category_groups/`,
        fetcher
    );

    return {
        groups: data as Group[],
        isLoading: !error && !data,
        isError: error,

        pushGroup: async (group: any) => {
            const createdGroup = await fetch(
                `${process.env.REACT_APP_API}/admin/category_groups/create/`,
                {
                    method: "POST",
                    body: JSON.stringify(group),
                    credentials: "include",
                }
            ).then((res) => res.json());

            mutate([...(data as Group[]), createdGroup]);
        },

        deleteGroup: async (groupId: number) => {
            await fetch(
                `${process.env.REACT_APP_API}/admin/category_groups/delete/`,
                {
                    method: "POST",
                    body: JSON.stringify({ id: groupId }),
                    credentials: "include",
                }
            );

            mutate([
                ...(data as Group[]).filter((group) => group.id !== groupId),
            ]);
        },
    };
};

export default useGroups;
