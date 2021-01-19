import useSWR from "swr"
import fetcher from "./fetcher"

const useCategories = () => {
    const { data, error } = useSWR(`/admin/categories/`, fetcher)
    
    return {
        user: data,
        isLoading: !error && !data,
        isError: error
    }
}

export default useCategories
