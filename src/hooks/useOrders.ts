import useSWR from "swr"
import fetcher from "./fetcher"

const useOrders = () => {
    const { data, error } = useSWR(`/admin/orders/`, fetcher)
    
    return {
        user: data,
        isLoading: !error && !data,
        isError: error
    }
}

export default useOrders
