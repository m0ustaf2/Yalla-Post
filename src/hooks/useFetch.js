import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useFetch(queryKey,endPoint,userData){

    const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: getPostDetails,
    select: (data) => data.data,
    enabled:!!userData
  });
  
  console.log(data);
  async function getPostDetails() {
    return await axios.get(`${import.meta.env.VITE_BASE_URL}/${endPoint}`, {
      headers: { token: localStorage.getItem("token") },
    });
  }
return {data,isLoading,isError,error }
}