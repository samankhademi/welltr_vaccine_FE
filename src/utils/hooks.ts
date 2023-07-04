import { storeKeys } from "configs/storage";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export function useGuard() {

    const history = useHistory();

    useEffect(() => {
        const tokenData = window.localStorage.getItem(storeKeys.AUTH_DATA);
        if (!tokenData)
            history.push("/");
    }, []);
}
