import useSWR from "swr"
import fetcher from "./fetcher"

const useCategories = () => {
    const { data, error } = useSWR(`/admin/categories/`, fetcher)
    
    return {
        categories: data,
        isLoading: !error && !data,
        isError: error
    }
}

export default useCategories
