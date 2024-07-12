import React, { useEffect, useState } from 'react'
import { BrowserRouter, HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Login from '../Pages/Login';
import httpclient from '../Utils';
import { useParams } from 'react-router-dom';
import Home from '../Pages/Home';
// import Orders from '../Pages/Orders';
// import Roles from '../Pages/Roles';
import Companies from '../Pages/Companies';
import NotFound from '../Pages/NotFound';
import { Box } from '@mui/material';
import MiniDrawer from '../Components/Drawer';
import useTokenRefresh from '../Hooks/useTokenRefresh';
import Error404 from '../Components/Error404';


const Routing = () => {
    const refresh = useTokenRefresh();
    const [menuList, setMenuList] = useState([]);

    const ProtectedRoute = ({ children }) => {
        return localStorage.getItem("token") ? (
          <MiniDrawer children={children} />
        ) : (
          <Navigate to="/login"></Navigate>
        );
      };

    const componentMapping = {

        // Orders: Orders,
        // Roles: Roles,
        Companies: Companies,

    };

    useEffect(() => {
        getAllMenus();
    }, []);


    const getAllMenus = () => {
        httpclient
            .get(`admin-menu-list`)
            .then(({ data }) => {
                if (data.status === 200) {
                    setMenuList(data.data);
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                  refresh();
                }
              });
    };

    return (
        <BrowserRouter>
            <Routes basename="/safepak">

                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

                {menuList.map((menu) => {
                    const componentName = menu.component;
                    const Component = componentMapping[componentName];

                    if (!Component) {
                        console.warn(`Component for ${componentName} not found`);
                        return (
                            <Route

                                key={menu.id}
                                path={`${menu.path}`}
                                element={<ProtectedRoute><Error404 /></ProtectedRoute>}
                            />
                        );
                    }

                    return (
                        <Route
                            key={menu.id}
                            path={`${menu.path}`}
                            element={<ProtectedRoute><Component permissions={menu.permissions} /></ProtectedRoute>}
                        />
                    );
                })}


            </Routes>
        </BrowserRouter>
    );
}

export default Routing;
