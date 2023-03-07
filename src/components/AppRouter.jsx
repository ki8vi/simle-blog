import {Routes, Route, Navigate} from "react-router-dom"
import About from "../pages/About";
import Posts from "../pages/Posts";
import Error from "../pages/error";
import PostIdPage from "../pages/PostIdPage";
import { privateRoutes, publicRoutes } from "../router/routes";
import { useContext } from "react";
import { AuthContext } from "../context";
import Loader from "./UI/Loader/Loader";

const AppRouter = () => {
  
    const {isAuth, isLoading} = useContext(AuthContext);
    

    if (isLoading) {
        return <Loader />
    }
    return (
        isAuth
            ?

            <Routes>
                {privateRoutes.map((route, index) => 
                    <Route 
                        element = {route.element}
                        path = {route.path}
                        key = {index}
                        exact = {route.exact}
                    />
                )}
                <Route path="/error" element={<Error />} />
                <Route path="/*" element={<Navigate to="/posts" />} />
            </Routes>
            :
            <Routes>
                {publicRoutes.map((route, index) => 
                    <Route 
                        element = {route.element}
                        path = {route.path}
                        key = {index}
                        exact = {route.exact}
                    />
                )}
                <Route path="/error" element={<Error />} />
                <Route path="/*" element={<Navigate to="/login" />} />
            </Routes>
    )
}
export default AppRouter;