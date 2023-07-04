import { AuthData } from "api";
import axios from "axios";
import i18n from "i18n/i18n";
import { storeKeys } from "./storage";


axios.interceptors.request.use(function (config) {
    const storedAuth: string | null = window.localStorage.getItem(storeKeys.AUTH_DATA);
    config.headers["Accept-Language"] = i18n.language;
    if (storedAuth && storedAuth !== "") {
        const authData: AuthData = JSON.parse(storedAuth);
        config.headers.Authorization = authData.token_type + " " + authData.access_token;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
