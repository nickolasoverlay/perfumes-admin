import useSWR from "swr"
import fetcher from "./fetcher"

const useGroups = () => {
    const { data, error } = useSWR(`/admin/category_groups/`, fetcher)
    
    return {
        user: data,
        isLoading: !error && !data,
        isError: error
    }
}

export default useGroups
