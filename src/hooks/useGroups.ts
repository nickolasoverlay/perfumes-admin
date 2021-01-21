import useSWR from "swr";
import fetcher from "./fetcher";

const useGroups = () => {
  const { data, error } = useSWR(
    `${process.env.REACT_APP_API}/admin/category_groups/`,
    fetcher
  );

  return {
    groups: data,
    isLoading: !error && !data,
    isError: error,

    pushGroup: async (group: any) => {
      await fetch(
        `${process.env.REACT_APP_API}/admin/category_groups/create/`,
        {
          method: "POST",
          body: JSON.stringify(group),
          credentials: "include",
        }
      );
    },
  };
};

export default useGroups;
