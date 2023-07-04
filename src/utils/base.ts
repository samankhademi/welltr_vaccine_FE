import { AuthData } from "api";
import { storeKeys } from "configs/storage";
import { expiryDayThreshold } from "configs/validations";
import i18n from "i18n/i18n";

export function getUrlParameterByName(name: string, url: string): string | null {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const maskData = (e: any) => {
    var v = e.target.value;
    if (v.match(/^\d{4}$/) !== null) {
        if (e.key !== "Backspace")
            e.target.value = v + '-';
    } else if (v.match(/^\d{4}\-\d{2}$/) !== null) {
        if (e.key !== "Backspace")
            e.target.value = v + '-';
    }
    return e.target.value
}

export const convertLirToEuro = (amount = 0): number => {
    return amount / 10;
}

export const getTextAlignByLang = (lang: string) => {
    if (lang === "fa") {
        return "right";
    } else {
        return "left";
    }
}

export const getDirectionByLang = (lang: string) => {
    if (lang === "fa") {
        return "rtl";
    } else {
        return "ltr";
    }
}

export const storeUserAuth = (authData: AuthData) => {
    const authWithIssuedTime = {...authData};
    const currentTimeStamp = new Date().getTime();
    authWithIssuedTime.issued_at = Math.floor(currentTimeStamp / 100);
    window.localStorage.setItem(storeKeys.AUTH_DATA, JSON.stringify(authWithIssuedTime));
}

export const isUserSessionOpen = (): boolean => {
    const userAuthData: string| null = window.localStorage.getItem(storeKeys.AUTH_DATA);
    if (userAuthData) {
        const parsedUserAuthData: AuthData = JSON.parse(userAuthData);
        const currentTimeStamp = Math.floor(new Date().getTime() / 100);
        if (parsedUserAuthData.issued_at + parsedUserAuthData.expires_in > currentTimeStamp)
            return true;
        localStorage.removeItem(storeKeys.AUTH_DATA);
    }
    return false;
}

export const emptyValidation = (key: string, object: any): boolean => {
    if (object.hasOwnProperty(key)) {
        return object[key] !== "";
    }
    return false;
}

export const passportExpiryValidation = (date: string): boolean => {
    const isDateValid = dateValidation(date);
    if (!isDateValid)
        return false;
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDayThreshold);
    const passportDate = new Date(date).getTime();
    return passportDate > expiryDate.getTime();
}

export const birthDateValidation = (date: string): boolean => {
    const isDateValid = dateValidation(date);
    if (!isDateValid)
        return false;
    const birthDate = new Date(date).getTime();
    const currentDate = new Date().getTime();
    return currentDate > birthDate;
}

export const dateValidation = (date: string): boolean => {
    const dashCharNum = date.match(/-/g)?.length
    return dashCharNum == 2;
}

export const nationalIdValidation = (nationalId: string): boolean => {
    return nationalId.length === 10;
}

export const isValidEnglish = (value:string):boolean => {
    const regex =/^[a-zA-Z0-9-, ]+$/;
    if (value && !regex.test(value)) return false
    return true
}

export const isValidEmailType = (value:string):boolean => {
    const regex =/^[a-zA-Z0-9-,@._]+$/;
    if (value && !regex.test(value)) return false
    return true
}

export const isValidEmail = (value:string):boolean => {
    if(String(value).toLowerCase().match(/\S+@\S+\.\S+/)){
        return true
    }
    return false
}