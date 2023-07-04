import React, { ReactElement, useState } from "react";
import { useEffect } from "react";
import * as API from "api";
import { getUrlParameterByName } from "utils/base";
import { RouteComponentProps } from "react-router-dom";
import Page from "components/Page/Page";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type SuccessProps = {

} & RouteComponentProps;

const Success = (props: SuccessProps): ReactElement => {
    
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

export default Success;
