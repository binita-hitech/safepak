import { useState, useEffect, useCallback } from 'react';
import httpclient from '../Utils';



const useTokenRefresh = () => {

    var loginToken = localStorage.getItem("token");
    var loginTok = JSON.parse(loginToken);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState("");

    const getTokenRefreshed = () => {
        let formData = new FormData();
        formData.append("refresh", loginTok);

        httpclient
            .post(`admin-refresh-token`, formData)
            .then(({ data }) => {
                if (data.status === 200) {
                    localStorage.removeItem("token");
                    localStorage.setItem("token", JSON.stringify(data.data.access_token));
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }else if (data.status === 400) {
                    const errorMessages = Object.values(data.errors).flat();
                    setOpen(true);
                    setMessage(errorMessages);
                    setMessageState("error");
                   
                } else {
                    setOpen(true);
                    setMessage(data.message);
                    setMessageState("error");
                   
                }
            })
            .catch(error => {
                console.error("Token refresh error:", error);
            });
    };

    return {getTokenRefreshed, open, message, messageState};
};


export default useTokenRefresh;
