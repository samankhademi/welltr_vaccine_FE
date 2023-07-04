import DescriptionCard from "components/DescriptionCard/DescriptionCard";
import Page from "components/Page/Page";
import React, { ReactElement } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import OrderLayout from "../OrderLayout/OrderLayout";
import styles from "./Result.module.css"

type ResultProps = {}

function Result(): ReactElement {

    const {t} = useTranslation();
    
    const contact = useSelector((state: RootState) => state.registration.contact)

    return (
        <Page>
            <OrderLayout
                hideNextButton={true}
                hideClearButton={true}
                onNextClick={() => {}}
                onClearClick={() => {}}
                enableSteps={["1", "2", "3"]}>
                <Container>
                    <Row className={styles.content_container}>
                        <Col md={{ span: 4, offset: 4 }}>
                            <DescriptionCard
                                title={t("email")}
                                text={contact.email}/>
                            <DescriptionCard
                                title={t("phoneNumber")}
                                text={contact.phoneNumber}/>
                            <p className={styles.content_text}>
                                {t("resultText")}
                            </p>
                        </Col>
                    </Row>
                </Container>
            </OrderLayout>
        </Page>
    )
}

export default Result;
