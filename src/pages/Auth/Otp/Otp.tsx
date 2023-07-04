import Page from "components/Page/Page";
import React, { ReactElement } from "react";
import { useState } from "react";
import { Button, Col, Container, FormControl, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import baseStyles from "styles/base.module.css";
import styles from "../Signin/Signin.module.css";
import * as Api from "api";
import { getTextAlignByLang } from "utils/base";
import {isValidEmail, isValidEmailType} from "utils/base";

export type OtpProps = {} & RouteComponentProps;

const Otp = (props: OtpProps): ReactElement => {
    
    const {t, i18n} = useTranslation();

    const [loading, setLoading] = useState<boolean>(false);

    const [email, setEmail] = useState<string>("");

    const [showError, setShowError] = useState({
        show: false,
        message: "",
        code: 0
    })

    const onGetOtp = () => {
        if(!isValidEmail(email)) {
            setShowError({
                show: true,
                message: t('emailIsNotValid'),
                code: 401
            });
            return false;
        }

        setLoading(true);
        Api.sendOtp(email).then(response => {
            if (response.data.statusCode === 200) {
                props.history.push("/auth/signin/" + email);
            } else {
                setShowError({
                    show: true,
                    message: response.data.statusMessage,
                    code: response.data.statusCode
                });
            }
        }).catch(error => {
            if (error.response) {
                setShowError({
                    show: true,
                    message: error.response.data.statusMessage,
                    code: error.response.data.statusCode
                });
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleClose = () => {
        setShowError({
            show: false,
            message: "",
            code: 0
        })
    }
    const onChangeEmail = (value:string) => {
        if(isValidEmailType(value)) setEmail(value.toLowerCase())
    }
    const goToRegister = () => props.history.push('/order/person');

    return (
        <Page
            isRegisterEnable
            isSignInEnable={false}>
            <Modal show={showError.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("sendOtpFailed")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{showError.message}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t("close")}
                </Button>
                <Button variant="primary" onClick={showError.code === 400 ? goToRegister : onGetOtp}>
                    {showError.code === 400 ? t("register") : t("tryAgain")}

                </Button>
                </Modal.Footer>
            </Modal>
            <Container className={styles.inputs_container}>
                <div className={styles.login_holder}>
                    <Container fluid style={{padding:0}}>
                        <Row style={{height:"100%"}}>
                            <Col md={6}>
                                <div className={styles.login_section}>
                                    <div className={styles.inputHolder}>
                                        <div className={styles.inputs_title}>
                                            {t("signin")}
                                        </div>

                                        <label
                                            className={baseStyles.input_label}
                                            htmlFor="basic-url">{t("email")}</label>
                                            <InputGroup className="mb-3">
                                                <FormControl
                                                    style={{textAlign:getTextAlignByLang(i18n.language)}}
                                                    value={email}
                                                    placeholder={t("enterEmail")}
                                                    name="phoneNumber"
                                                    onChange={(event) => onChangeEmail(event.target.value)}
                                                    className={`${baseStyles.input} ${styles.inputEmail}`}
                                                    id="basic-url"
                                                    aria-describedby="basic-addon3" />
                                            </InputGroup>
                                    </div>
                                    <div className={styles.login_button_holder}>
                                        <Button
                                            disabled={loading}
                                            className={styles.login_button}
                                            onClick={onGetOtp}
                                            color={"red"}
                                            variant="primary">
                                            {
                                                loading ? <Spinner animation="border" /> : t("getOtp")
                                            }
                                        </Button>
                                        <div className={styles.divider}>
                                            <div>{t('noYetRegistered')}</div>
                                        </div>
                                        <Button
                                            className={styles.login_button}
                                            onClick={()=> props.history.push('/order/person')}
                                            variant="outline-primary"
                                        >
                                                {t("register")}
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className={`${styles.intro_holder} intro_holder`}>
                                    <div className={styles.intro_text}>
                                        {t('weMakeYouImmunities')}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Container>
        </Page>
    )
}

export default Otp;
