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
                }else {
                    setOpen(true);
                    setMessage(data.message);
                    setMessageState("error");
                  
                }

            }).catch((err) => {
                if (err.response.status === 422) {
                    const errorMessages = Object.values(err.response.data.errors).flat();
                    setOpen(true);
                    setMessage(errorMessages[0]);
                    setMessageState("error");
             
                } else if (err.response.status === 400) {
                    const errorMessages = Object.values(err.response.data.errors).flat();
                    setOpen(true);
                    setMessage(errorMessages[0]);
                    setMessageState("error");
              

                } else {
                    setOpen(true);
                    setMessage(err.response.data.message);
                    setMessageState("error");
                    
                }
            })
    };

    return {getTokenRefreshed, open, message, messageState, setOpen};
};


export default useTokenRefresh;
