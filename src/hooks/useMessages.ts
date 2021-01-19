import useSWR from "swr"
import fetcher from "./fetcher"

const useMessages = () => {
    const { data, error } = useSWR(`/admin/messages/`, fetcher)
    
    return {
        user: data,
        isLoading: !error && !data,
        isError: error
    }
}

export default useMessages
