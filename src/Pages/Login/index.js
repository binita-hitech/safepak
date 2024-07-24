import React, { useState, useEffect } from 'react';
import { Box, Button, Card, Container, CssBaseline, FormGroup, Grid, TextField, Snackbar, CircularProgress } from '@mui/material';
import { AccountCircle, Https, Menu } from '@mui/icons-material';
import { styled } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import httpclient from '../../Utils';
import Img from '../../Components/Images/synccareNew.png'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GridBlockContent = styled("div")(({ theme }) => ({
    display: "grid",
    maxWidth: "100%",
    gridTemplateColumns: "auto",
    gap: "1px solid #ccc",
    fontFamily: "Poppins !important",
    fontSize: "14px",
    fontWeight: "bold",
}));

const GridBlockTitle = styled("div")(({ theme }) => ({
    borderBottom: "1px solid #f1f1f1",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    padding: "16px",
    fontSize: "16px",
    textAlign: "left",
}));

const Login = () => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
   
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
   
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const handleKeyPassword = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    }

    const handleSubmit = () => {
        setLoading(true);
        let formData = new FormData();
    
        formData.append("identity", loginData.username);
        formData.append("password", loginData.password);

        httpclient.post(`admin-login`, formData).then(({ data }) => {
            if (data.status === 200) {
                localStorage.setItem("user", JSON.stringify(data.data.user));
                localStorage.setItem("token", JSON.stringify(data.data.access_token));
                setOpen(true);
                setMessageState("success");
                setMessage(data.message);
                setLoading(false);
                setTimeout(() => {
                    window.location = "/safepak/";
                }, 1000);
            } else {
                setOpen(true);
                setMessage(data.message);
                setMessageState("error");
                setLoading(false);
            }

        }).catch((err) => {
           if (err.response.status === 422) {
                const errorMessages = Object.values(err.response.data.errors).flat();
                setOpen(true);
                setMessage(errorMessages);
                setMessageState("error");
                setLoading(false);
            } else if (err.response.status === 400) {
                const errorMessages = Object.values(err.response.data.errors).flat();
                setOpen(true);
                setMessage(errorMessages);
                setMessageState("error");
                setLoading(false);

            }else if (err.response.status === 404) {
                setOpen(true);
                setMessage(err.response.data.message);
                setMessageState("error");
                setLoading(false);

            } else {
                setOpen(true);
                setMessage(err.response.data.message);
                setMessageState("error");
                setLoading(false);
            }
        })
    }


    return (
        <div>
            <Container component="main" maxWidth="sm" style={{ textAlign: 'center', marginTop: '120px' }}>
                <CssBaseline />
                <Card style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} textAlign="center">
                            <img src={Img} alt="img"/>
                        </Grid>
                        <Grid item xs={12}>

                            <FormGroup>
                                <GridBlockContent>
                            
                                    <Box pt={2} pb={1}>
                                        
                                        <Box p={2} pb={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                            <TextField
                                                id="input-with-sx"
                                                label=""
                                                placeholder="Username"
                                                variant="standard"
                                                name="username"
                                                type="text"
                                                value={loginData.username}
                                                onChange={(e) => handleChange(e)}
                                                sx={{ width: '100%' }} />
                                        </Box>
                                        <Box p={2} pb={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <Https sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                            <TextField
                                                id="input-with-sx"
                                                label=""
                                                placeholder="Password"
                                                variant="standard"
                                                name="password"
                                                type="password"
                                                value={loginData.password}
                                                onKeyDown={handleKeyPassword}
                                                onChange={(e) => handleChange(e)}
                                                sx={{ width: '100%' }} />
                                        </Box>
                                    </Box>
                                    <Box p={2} textAlign={"right"}>
                                        {loading ?
                                            <Button
                                                variant="contained"
                                                color="primary"
                                            >
                                                <CircularProgress style={{ height: "20px", width: "20px", color: "#fff", marginRight: "10px" }} /> Loading
                                            </Button> :
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={handleSubmit}
                                            >
                                                <b>Login</b>
                                            </Button>
                                        }
                                    </Box>
                                </GridBlockContent>
                            </FormGroup>
                        </Grid>
                    </Grid>



                </Card>
            </Container>

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
        </div >
    );
}

export default Login;

