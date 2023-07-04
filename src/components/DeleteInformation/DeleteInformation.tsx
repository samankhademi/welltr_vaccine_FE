import React, { ReactElement } from "react";
import styles from "./DeleteInformation.module.css";
import { Container, Row, Col } from "react-bootstrap";
import {ReactComponent as DeleteIcon} from "./assets/delete_icon.svg";
import { useTranslation } from "react-i18next";

const DeleteInformation = (): ReactElement => {

    const {t} = useTranslation();

    return (
        <Container fluid>
            <Row>
                <Col md={{span: 8, offset: 2}}>
                    <DeleteIcon className={styles.delete_icon}/>
                </Col>
            </Row>
            <Row>
                <Col md={{span: 8, offset: 2}}>
                    <p className={styles.delete_title}>{t("delete")}</p>
                    <p
                        className={`${styles.delete_title} ${styles.sure_text}`}>
                            {t("sureText")}</p>
                </Col>
            </Row>
        </Container>
    )
}

export default DeleteInformation;
