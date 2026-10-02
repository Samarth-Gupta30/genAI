import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import Loader from '../../../components/Loader'

const Protected = ({children}) => {
    const { loading, user } = useAuth()
    const location = useLocation()

    if(loading){
        return (<main><Loader /></main>)
    }

    if(!user){
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    return children
}

export default Protected
