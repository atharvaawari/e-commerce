import { useQuery } from "@tanstack/react-query";
import { getCurrentUserQueryFn } from "../../lib/api";


const useAuth = () => {
    const query = useQuery({
        queryKey: ["authUser"],
        queryFn: getCurrentUserQueryFn,
        staleTime: 0, // 1 minutes
        retry: false,
        
    })
    return query;
}

export default useAuth;