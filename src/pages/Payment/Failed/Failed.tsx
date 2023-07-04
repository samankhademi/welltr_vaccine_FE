import Page from "components/Page/Page";
import React, { useState } from "react";
import { useEffect } from "react";
import { ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { getUrlParameterByName } from "utils/base";

type FailedProps = {

} & RouteComponentProps;

const Failed = (props: FailedProps): ReactElement => {

    const {t} = useTranslation();

    const [showError, setShowError] = useState({
        show: false,
        message: ""
    });
    
    useEffect(() => {
        const paymentMessage: string | null = getUrlParameterByName(
            "message",
            window.location.href
        );
        setShowError({
            show: true,
            message: (paymentMessage) ? paymentMessage : ''
        })
    });

    return <Page>
        
        {
            showError.show && 
            <Modal
                show={showError.show}
                onHide={() => props.history.push("/profile/payment")}>
                <Modal.Header closeButton>
                <Modal.Title>{t("paymentResult")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{showError.message}</Modal.Body>
                <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => props.history.push("/profile/payment")}>
                    {t("confirm")}
                </Button>
                </Modal.Footer>
            </Modal>
        }
        
    </Page>
}

export default Failed;
