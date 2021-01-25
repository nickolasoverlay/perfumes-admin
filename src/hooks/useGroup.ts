import useSWR from "swr";
import fetcher from "./fetcher";

import { Group } from "./../pages/CategoryGroups/types";

const useGroup = (id: string) => {
    const { data, mutate, error } = useSWR<Group>(
        `${process.env.REACT_APP_API}/admin/category_groups/${id}/`,
        fetcher
    );

    return {
        group: data as Group,
        isLoading: !error && !data,
        isError: error,

        updateGroup: async (group: Group) => {
            await fetch(
                `${process.env.REACT_APP_API}/admin/category_groups/update/`,
                {
                    method: "POST",
                    body: JSON.stringify(group),
                    credentials: "include",
                }
            );

            mutate({ ...data, ...group });
        },

        updateGroupWallpaper: (wallpaper: string) => {
            const group: Group = data as Group;
            group.wallpaper = wallpaper;

            mutate({ ...data, ...group });
        },
    };
};

export default useGroup;
