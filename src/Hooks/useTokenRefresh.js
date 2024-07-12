import { useState, useEffect, useCallback } from 'react';
import httpclient from '../Utils';



const useTokenRefresh = () => {

    var loginToken = localStorage.getItem("token");
    var loginTok = JSON.parse(loginToken);

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
                }
            })
            .catch(error => {
                console.error("Token refresh error:", error);
            });
    };

    return getTokenRefreshed;
};

export default useTokenRefresh;
