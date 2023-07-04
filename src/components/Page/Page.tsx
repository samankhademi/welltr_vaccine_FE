import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import {
    Container, Col, Row, Button,
    DropdownButton, Dropdown, Spinner} from "react-bootstrap";
import styles from "./Page.module.css";
import {ReactComponent as VaccineLogo} from "./assets/vaccine_logo.svg";
import {ReactComponent as VaccineLogoRtl} from "./assets/vaccine_logo_rtl.svg";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { storeKeys } from "configs/storage";
import { getTextAlignByLang, isUserSessionOpen } from "utils/base";
import { useState } from "react";
import { useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { useEffect } from "react";
import { fetchOrder } from "pages/Profile/profileSlice";


type PageProps = {
    isRegisterEnable?: boolean,
    paddingBottom?: string,
    isSignOutEnable?:boolean,
    isSignInEnable?:boolean
} & PropsWithChildren<ReactNode>;

function Page({
    isRegisterEnable = false,
    paddingBottom = "0",
    isSignInEnable = true,
    isSignOutEnable = false,
    children
}: PageProps): ReactElement {

    const {t, i18n} = useTranslation();
    const history = useHistory();

    const onSignOutClickHandler = (): void => {
        window.localStorage.removeItem(storeKeys.AUTH_DATA);
        setUpdateLoginStatus(!updateLoginStatus);
        history.push("/");
    }

    const onHomeClickHandler = () => {
        history.push("/");
    }
    const currentLanguage = localStorage.getItem('currentLang') || i18n.language;
    const [language, setLanguage] = useState<string>(currentLanguage);

    const [updateLoginStatus, setUpdateLoginStatus] = useState<boolean>(false);

    const isUserLoggedIn: boolean = useMemo(() => isUserSessionOpen(), [updateLoginStatus]);
    
    const order = useSelector((state: RootState) => state.profile.order);
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (!order.fetched && isUserLoggedIn) {
            dispatch(fetchOrder());
        }
        setTimeout(() =>{
            i18n.changeLanguage(language);
        },0)
        checkDirection(language);
    }, [])

    //call on user change language
    useEffect(() => {
        localStorage.setItem('currentLang', language);
        checkDirection(language)
    }, [language])
    const checkDirection = (language: string) => {
        const html = document.querySelector('html')
        if(!html) return
        if(language === 'fa'){
            html.classList.add('rtl')
            html.classList.remove('ltr')
        }else {
            html.classList.add('ltr')
            html.classList.remove('rtl')

        }

    }
    return (
        <div
            style={{
                paddingBottom: paddingBottom,
                textAlign: getTextAlignByLang(i18n.language)}}
            className={styles.page_container}>
            <Container className={styles.header_container} fluid>
                <Row>
                    <Col md={2}/>
                    <Col
                        onClick={onHomeClickHandler}
                        className={styles.icon_container}
                        md={5}>
                        {language === 'fa' ? <VaccineLogoRtl/> : <VaccineLogo/>}
                    </Col>
                    <Col className={
                        [styles.icon_container,
                        styles.icon_container__right].join(" ")} md={3}>
                            {
                                (isRegisterEnable && !isUserLoggedIn) && 
                                <Button
                                    onClick={() => history.push("/order/person")}
                                    className={styles.header_button}
                                    variant='primary'>
                                    {t("register")}
                                </Button>
                            }
                            
                            {
                                (isSignInEnable && !isUserLoggedIn) && 
                                <Button
                                    onClick={() => {
                                        history.push("/auth/otp");
                                    }}
                                    className={styles.header_button}
                                    variant={"primary-title"}>
                                        { t("signin") }
                                </Button>
                            }
                            
                            {
                                isUserLoggedIn &&
                                <>
                                        <DropdownButton
                                            onSelect={(e) => {
                                                if (e === "signin") {
                                                    history.push("/profile/payment")
                                                } else {
                                                    onSignOutClickHandler()
                                                }
                                            }}
                                            variant={"primary-title"}
                                            className={styles.header_button}
                                            title={(order.data.user) ? order.data.user.email : ""}>
                                            <Dropdown.Item eventKey="signin">{t("signin")}</Dropdown.Item>
                                            <Dropdown.Item eventKey="signout">{t("signout")}</Dropdown.Item>
                                        </DropdownButton>
                                </>
                            }

                            <DropdownButton
                                onSelect={(e) => {
                                    i18n.changeLanguage(e ? e : "en");
                                    setLanguage(e ? e : "en");
                                }}
                                variant={"primary-title"}
                                className={styles.header_button}
                                title={language.toUpperCase()}>
                                <Dropdown.Item eventKey="en">EN</Dropdown.Item>
                                <Dropdown.Item eventKey="fa">FA</Dropdown.Item>
                                <Dropdown.Item eventKey="es">ES</Dropdown.Item>
                            </DropdownButton>
                    </Col>
                    <Col md={2}/>
                </Row>
            </Container>
            {children}
            <Container fluid className={styles.footer_container}>
                <p className={styles.footer_desc}>
                    {t("footerDesc1")} <br/>
                    {t("footerDesc2")}
                </p>
            </Container>
        </div>
    )
}

export default Page;