import Page from "components/Page/Page";
import React, { ReactElement } from "react";
import { useState } from "react";
import { Button, Col, Container, FormControl, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import baseStyles from "styles/base.module.css";
import styles from "./Signin.module.css";
import * as Api from "api";
import { getTextAlignByLang, storeUserAuth } from "utils/base";

export type SignInProps = {} & RouteComponentProps<{email: string}>;

const SignIn = (props: SignInProps): ReactElement => {

    const [otp, setOtp] = useState<string>("");

    const [showError, setShowError] = useState({
        show: false,
        message: ""
    });
    
    const [loading, setLoading] = useState<boolean>(false);
    
    const {t, i18n} = useTranslation();

    const onLoginHandler = () => {
        setLoading(true);
        handleClose();
        Api.login(props.match.params.email, otp).then(response => {
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
            }
        }).finally(() => {
            setLoading(false);
        })
    }
    
    const handleClose = () => {
        setShowError({
            show: false,
            message: ""
        })
    }

    const onChangeOtp = (email:string) => {

        setOtp(email)
    }

    return (
        <Page isRegisterEnable isSignInEnable={false}>
            <Container className={styles.inputs_container}>
                <Modal show={showError.show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>{t("loginFailed")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{showError.message}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t("close")}
                    </Button>
                    </Modal.Footer>
                </Modal>
                <div className={styles.login_holder}>
                    <Container fluid style={{padding: 0}}>
                        <Row style={{height: "100%"}}>
                            <Col md={6}>
                            <div className={styles.login_section}>
                                <div className={styles.inputHolder}>
                                    <div className={styles.inputs_title}>
                                        {t("activation")}
                                    </div>
                                    <div className={styles.login_text}>
                                        {t("otpMessage")}
                                    </div>

                                    <label className={baseStyles.input_label} htmlFor="activationCode">{t("activationText")}</label>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            style={{textAlign: getTextAlignByLang(i18n.language)}}
                                            value={otp}
                                            placeholder={t("activationText")}
                                            name="activationCode"
                                            type="number"
                                            onChange={(event) => onChangeOtp(event.target.value)}
                                            className={`${baseStyles.input} ${styles.inputOtp}`}
                                            id="activationCode"
                                        />
                                    </InputGroup>
                                </div>
                                <div className={styles.login_button_holder}>
                                    <Button
                                        disabled={loading}
                                        className={styles.login_button}
                                        onClick={onLoginHandler}
                                        color={"red"}
                                        variant="primary">
                                        {
                                            loading ? <Spinner animation="border"/> : t("login")
                                        }
                                    </Button>
                                    <div className={styles.divider}>
                                        <div>{t('haveNotReceivedTheCodeYet?')}</div>
                                    </div>
                                    <Button
                                        className={styles.login_button}
                                        onClick={()=> props.history.push('/auth/otp')}
                                        variant="outline-primary"
                                    >
                                        {t("getNewOTP")}
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

export default SignIn;
