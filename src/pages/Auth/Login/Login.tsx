import React, { ReactElement } from "react";
import { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import * as Api from "api";
import { getUrlParameterByName, isUserSessionOpen, storeUserAuth } from "utils/base";
import Page from "components/Page/Page";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "react-bootstrap";
import Ellipsis from "components/Ellipsis/Ellipsis";

export type LoginProps = {} & RouteComponentProps;

const Login = (props: LoginProps): ReactElement => {

    const [t] = useTranslation();

    const [loading, setLoading] = useState<boolean>(false);

    const [showError, setShowError] = useState({
        show: false,
        message: ""
    });

    const onLoginHandler = () => {
        const otp = getUrlParameterByName("otp", window.location.href);
        const email = getUrlParameterByName("email", window.location.href);
        if (isUserSessionOpen()) {
            props.history.push("/profile/payment");
        } else {
            if (otp && email) { 
                setLoading(true);
                handleClose();
                Api.login(email, otp).then(response => {
                    if (response.data.statusCode === 200) {
                        storeUserAuth(response.data.content);
                        props.history.push("/profile/payment");
                    } else {
                        setShowError({
                            show: true,
                            message: response.data.statusMessage
                        });
                    }
                }).catch(error => {
                    if (error.response) {
                        setShowError({
                            show: true,
                            message: error.response.data.statusMessage
                        });
                    } else {
                        setShowError({
                            show: true,
                            message: t("connectionError")
                        })
                    }
                }).finally(() => {
                    setLoading(false);
                })
            } else {
                setShowError({
                    show: true,
                    message: t("linkError")
                })
            }
        }
        
    }

    useEffect(() => {
        onLoginHandler();
    }, []);

    const handleClose = () => {
        props.history.replace('/')
        setShowError({
            show: false,
            message: ""
        })
    }

    return <Page>
        
        {
            loading && <div>
                <Ellipsis marginTop="50px"/>
            </div>
        }

        {
            showError.show && 
            <Modal show={showError.show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{t("loginFailed")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{showError.message}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t("close")}
                </Button>
                <Button variant="primary" onClick={() => onLoginHandler()}>
                    {t("tryAgain")}
                </Button>
                </Modal.Footer>
            </Modal>
        }

    </Page>
}

export default Login;
