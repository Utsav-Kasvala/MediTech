import {useState, useEffect} from 'react'
import { token } from '../config';// we can also use authcontext for token
//import {toast} from 'react-toastify'

const useFetchData = (url) => {

    const [data,setData]=useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(()=>{
        const fetchdata= async ()=>{
            try {
                setLoading(true)
                const res= await fetch(url, {
                    headers:{Authorization:`Bearer ${token}`}
                })
    
                const result= await res.json();
    
                if(!res.ok)
                {
                    
                    throw new Error(result.message + '🤮')
                }

                setData(result.data);
                setLoading(false)
            } catch (err) {
                setLoading(false)
                setError(err.message)
            }
        }

        fetchdata()
    },[url])
  return {
    data, loading, error
  }
}

export default useFetchData
