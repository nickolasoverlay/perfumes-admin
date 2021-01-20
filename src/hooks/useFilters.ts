import useSWR from "swr"
import fetcher from "./fetcher"

const useFilters = () => {
    const { data, error } = useSWR(`/admin/filters/`, fetcher)
    
    return {
        filters: data,
        isLoading: !error && !data,
        isError: error
    }
}

export default useFilters
