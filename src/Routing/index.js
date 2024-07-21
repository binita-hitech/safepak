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
import MiniDrawer from '../Components/Drawer';
import useTokenRefresh from '../Hooks/useTokenRefresh';
import Error404 from '../Components/Error404';
import MuiAlert from "@mui/material/Alert";
import {
    Box,  
    Snackbar,
} from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Routing = () => {
    const { getTokenRefreshed: refresh, open: tokenOpen, message: tokenMessage, messageState: tokenMessageState, setOpen: setTokenOpen } = useTokenRefresh();
    const [menuList, setMenuList] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState("");

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
        
    };

    const ProtectedRoute = ({ children }) => {
        return localStorage.getItem("token") ? (
          <MiniDrawer children={children} menuList={menuList}/>
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
                }else {
                    setOpen(true);
                    setMessage(data.message);
                    setMessageState("error");
               
                }
            }).catch((err) => {
                if (err.response.status === 401) {
                    refresh();
                    setOpen(tokenOpen);
                    setMessage(tokenMessage);
                    setMessageState("error");
                } else if (err.response.status === 422) {
                    const errorMessages = Object.values(err.response.data.errors).flat();
                    setOpen(true);
                    setMessage(errorMessages);
                    setMessageState("error");
                    
                } else if (err.response.status === 400) {
                    const errorMessages = Object.values(err.response.data.errors).flat();
                    setOpen(true);
                    setMessage(errorMessages);
                    setMessageState("error");
                

                } else {
                    setOpen(true);
                    setMessage(err.response.message);
                    setMessageState("error");
                  
                }
            })
    };

    return (
        <div>
        <BrowserRouter basename="/safepak">
            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home open={tokenOpen} setOpen={setTokenOpen} messageState={tokenMessageState} message={tokenMessage} /></ProtectedRoute>} />

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
        <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
        <Alert
            onClose={handleClose}
            severity={messageState}
            sx={{ width: "100%" }}
        >
            {message}
        </Alert>
    </Snackbar>
    </div>
    );
}

export default Routing;
