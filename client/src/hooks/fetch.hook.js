import axios from "axios";
import { useEffect, useState }  from "react"
import { getUsername } from "../helpers/helper";


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DAOMAIN;

// export default function useFetch(query){
//     const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError:null});

//     useEffect(()=> {
//         if(!query) return;
//         const fetchData = async () => {
//             try {
//                 setData(prev => ({...prev, isLoading: true}));

//                 // const { username }  = await getUsername()
//                 // !query ? await getUsername(): "";
//                 const {data, status} = axios.get(`/api/${query}`);
//                 // !query? await axios.get(`/api/user/${username}`) : axios.get(`/api/${query}`);

//                 if(status === 201){
//                     setData(prev => ({...prev, isLoading: false}));
//                     setData(prev => ({...prev, apiData: data, status: status}));
//                 }
//                 setData(prev => ({...prev, isLoading:false}))
//             } catch (error) {
//                 setData(prev => ({...prev, isLoading: false, serverError: error}))
//             }
//         };
//         fetchData();
//     },[query]);

//     return [getData, setData]
// }

/** custom hook */
export default function useFetch(query){
    const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })

    useEffect(() => {

        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true}));

                const { username } = !query ? await getUsername() : '';
                
                const { data, status } = !query ? await axios.get(`/api/user/${username}`) : await axios.get(`/api/${query}`);

                if(status === 201){
                    setData(prev => ({ ...prev, isLoading: false}));
                    setData(prev => ({ ...prev, apiData : data, status: status }));
                }

                setData(prev => ({ ...prev, isLoading: false}));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}