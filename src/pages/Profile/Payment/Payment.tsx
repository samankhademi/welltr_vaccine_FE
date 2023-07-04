import React, {ReactElement, useEffect, useRef, useState} from "react";
import Page from "components/Page/Page";
import ProfileLayout from "../ProfileLayout/ProfileLayout";
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import styles from "./Payment.module.css";
import {useTranslation,} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrder} from "../profileSlice";
import {RootState} from "store/store";
import Ellipsis from "components/Ellipsis/Ellipsis";
import * as API from "api";
import {OrderStatus} from "api";
import {useHistory} from "react-router-dom";
import {useGuard} from "utils/hooks";
import Toaster, {ToasterHandleMethods} from "components/Toaster/Toaster";
import {storeKeys} from "configs/storage";
import SummeryHolder from "./SummeryHolder";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export enum PaymentTypes {
    FULL = "FULL",
    PARTIAL = "PARTIAL",
    OFFLINE = "OFFLINE",
    USDT = "USDT"
}
export enum Steps {
    PERSONS = "PERSONS",
    FLIGHT_INFO = "FLIGHT_INFO",
    PAYMENT = "PAYMENT"
}


const Payment = (): ReactElement => {

    const dispatch = useDispatch();

    useGuard();

    const history = useHistory();

    const order = useSelector((state: RootState) => state.profile.order);

    const [showError, setShowError] = useState({
        show: false,
        message: ""
    });

    const [step, setStep] = useState<Steps>(Steps.PERSONS);
    const [offAmount, setOffAmount] = useState<any>(false);

    const [paymentType, setPaymentType] = useState<PaymentTypes>();

    const [loading, setLoading] = useState<boolean>(false);

    const {t} = useTranslation();

    const toasterRef = useRef<ToasterHandleMethods>(null);

    useEffect(() => {
        if (paymentType)
            window.localStorage.setItem(storeKeys.PAYMENT_TYPE, paymentType);
    }, [paymentType]);

    useEffect(() => {
        dispatch(fetchOrder());
        //fetchExhanges();
        setDefaultPaymentType();
    }, []);

    useEffect(() => {
        if(order.data.status){
            switch (order.data.status) {
                case OrderStatus.WAITING_FOR_DATA_SUBMISSION:
                    setStep(Steps.PERSONS)
                    break;
                case OrderStatus.OPEN:
                    setStep(Steps.PERSONS)
                    break;
                case OrderStatus.WAITING_FOR_PAY:
                    setStep(Steps.PAYMENT)
                    break;
                case OrderStatus.WAITING_FOR_RECEIVING_FIRST_DOSE:
                    history.push('/profile/orders')
                    break;
                default:
                    setStep(Steps.PERSONS)
                    break;
            }
        }
    }, [order]);

    const setDefaultPaymentType = (): void => {
        const storedPaymentType: PaymentTypes | null = window.localStorage
            .getItem(storeKeys.PAYMENT_TYPE) as PaymentTypes;
        if (storedPaymentType) {
            setPaymentType(storedPaymentType);
        } else {
            setPaymentType(PaymentTypes.FULL)
        }
    }


    const onPaymentClickHandler = () => {
        handleClose();
        setLoading(true);
        API.getPaymentLink(order.data.id, paymentType).then(response => {
            if (response.data.statusCode === 200) {
                window.location.href = response.data.content.PaymentLink;
            } else {
                setShowError({
                    show: true,
                    message: response.data.statusMessage
                })
            }
        }).catch((error) => {
            if (error.response) {
                setShowError({
                    show: true,
                    message: error.response.data.statusMessage
                })
            }
        }).finally(() => {
            setLoading(false);
        })
    }
    
    const handleClose = () => {
        setShowError({
            show: false,
            message: ""
        });
    }

    const renderStep = ():ReactElement => {
        switch (step) {
            case Steps.PERSONS:
                return <Step1 onNext={() => setStep(Steps.FLIGHT_INFO)}/>;
            case Steps.FLIGHT_INFO:
                return <Step2 onNext={() => setStep(Steps.PAYMENT)} onBack={() => setStep(Steps.PERSONS)} onSetOff={(off: any) => setOffAmount(off)}/>;
            case Steps.PAYMENT:
                return <Step3/>;
            default:
                return <>{step}</>;
        }
    }

    return (
        <Page
            isSignInEnable={false}
            isSignOutEnable={true}
            paddingBottom="0">
                <ProfileLayout>
                    <Toaster ref={toasterRef}/>
                    <Modal show={showError.show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t("registrationFailed")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{showError.message}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                {t("close")}
                            </Button>
                            <Button variant="primary" onClick={onPaymentClickHandler}>
                                {t("tryAgain")}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {
                        (order.fetching && step !== Steps.PAYMENT) ? <Ellipsis marginTop="30px"/> : (
                            <>
                                    <Container fluid>
                                        <Row>
                                            <Col style={{marginBottom: "10px"}} md={8}>
                                                <div className={styles.holder}>
                                                    {renderStep()}
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <SummeryHolder offAmount={offAmount} />
                                            </Col>
                                        </Row>
                                    </Container>
                            </>
                        )
                    }

                </ProfileLayout>
        </Page>
    )
}

export default Payment;
