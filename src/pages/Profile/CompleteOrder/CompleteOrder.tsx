import React, { useRef,useEffect } from "react";
import Page from "components/Page/Page";
import { ReactElement } from "react";
import ProfileLayout from "../ProfileLayout/ProfileLayout";
import ContentCard from "components/ContentCard/ContentCard";
import Line from "components/Line/Line";
import { Button, Col, FormCheck, FormControl, InputGroup, Modal, Row, Spinner, Table } from "react-bootstrap";
import styles from "./CompleteOrder.module.css";
import baseStyles from "styles/base.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { useState } from "react";
import * as API from "api";
import { fetchOrder } from "../profileSlice";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { convertLirToEuro, maskData } from "utils/base";
import { useGuard } from "utils/hooks";
import Ellipsis from "components/Ellipsis/Ellipsis";
import CopyToClipboard from "react-copy-to-clipboard";
import Toaster, { ToasterHandleMethods } from "components/Toaster/Toaster";
import {ReactComponent as CopyIcon} from "assets/copy.svg";
import {ReactComponent as DeleteIcon} from "assets/delete_icon.svg";
import { PaymentTypes } from "../Payment/Payment";
// import QrCode from "assets/qrcode.png";

export type FlightForm = {
    flightNumber: string,
    companyName: string,
    arrivalDate: string
}

const maxOrderInquiry: number = 40;

let pullOrderInterval: any;

const CompleteOrder = (): ReactElement => {

    useGuard();
    
    const {t} = useTranslation();

    const order = useSelector((state: RootState) => state.profile.order.data);

    const orderLoading = useSelector((state: RootState) => state.profile.order.fetching);

    const [loadingCounter, setLoadingCounter] = useState(0);

    const [transactionCode, setTransactionCode] = useState("");

    useEffect(() => {
        if (orderLoading) {
            setLoadingCounter(loadingCounter + 1);
        }
    }, [orderLoading]);

    useEffect(() => {
        dispatch(fetchOrder());
        fetchExhanges();
        // pullOrderInterval = setInterval(() => {
        //     if (loadingCounter < maxOrderInquiry) {
        //         dispatch(fetchOrder());
        //     }
        // }, 1000000);
        // return () => {
        //     clearInterval(pullOrderInterval);
        // }
    }, []);

    const dispatch = useDispatch();

    const history = useHistory();
    
    const toasterRef = useRef<ToasterHandleMethods>(null);

    const [flightForm, setFlightForm] = useState<FlightForm>({
        flightNumber: "",
        companyName: "",
        arrivalDate: ""
    });

    const [coupons, setCoupons] = useState<string[]>([""]);

    const [loading, setLoading] = useState<boolean>(false);

    const [offAmount, setOffAmount] = useState<number>(0);

    const onFlighFormSubmitHandler = () => {
        let couponsData = [...coupons];
        if (coupons.length === 1 && coupons[0] == "") {
            couponsData = [];
        }
        setLoading(true);
        API.completeOrder(flightForm, couponsData).then(response => {
            dispatch(fetchOrder());
            pullOrderInterval = setInterval(() => {
                if (loadingCounter < maxOrderInquiry) {
                    dispatch(fetchOrder());
                }
            }, 5000);
        }).finally(() => {
            setLoading(false);
        })
    }
    
    const [exhanges, setExchanges] = useState<API.ExhangeListApi[]>([]);
    
    const [exchangeError, setExchangeError] = useState({
        error: false,
        message: ""
    });

    const fetchExhanges = (): void => {
        setLoading(true);
        API.fetchExchangeList()
        .then(response => {
            if (response.data.statusCode === 200) {
                setExchanges(response.data.content);
            } else {
                setShowError({
                    show: true,
                    message: response.data.statusMessage,
                    title: t("getExahngesError")
                })
            }
        }).catch(error => {
            if (error.response) {
                setExchangeError({
                    error: true,
                    message: error.response.data.statusMessage
                })
            }
        }).finally(() => {
            setLoading(false);
        });
    }


    const isCompleteFormValid = (): boolean => {
        for (const person of order.persons) {
            if (!person.passport_image || person.passport_image === "") {
                return false;
            }
        }
        return true;
    }

    function isPinsEmpty(): boolean {
        if (coupons.length === 1 && coupons[0] == "") {
            setShowError({
                show: true,
                message: t("pleaseEnterPinValue"),
                title: t("pinVerificationFailed")
            })
            return true;
        }
        let emptyPins = coupons.filter(pin => pin === "");
        if (emptyPins.length !== 0)
            setShowError({
                show: true,
                message: "pleaseFillAllOpenedPins",
                title: t("pinVerificationFailed")
            })
        return emptyPins.length !== 0
    }
    
    function onApplyHandler(): void {
        if (isPinsEmpty())
            return;
        API.applyCoupons({
            pins: coupons
        }).then(response => {
            setOffAmount(response.data.content.total_off);
        }).catch(error => {
            setShowError({
                show: true,
                message: error.response.data.statusMessage,
                title: t("pinVerificationFailed")
            })
        })
    }

    const [showError, setShowError] = useState({
        show: false,
        message: "",
        title: ""
    })

    const handleClose = () => {
        setShowError({
            show: false,
            message: "",
            title: ""
        })
    }
    
    const [paymentType, setPaymentType] = useState<PaymentTypes>(PaymentTypes.OFFLINE);
    
    const [showExchangeDetail, setShowExchangeDetail] = useState<boolean>(false);

    function isFloat(n: number | undefined){
        if (n) {
            let regexPattern = /^-?[0-9]+$/;
            // check if the passed number is integer or float
            let result = regexPattern.test(String(n));
            return !result;
        }
        return 0
    }

    const getPaymentAmount = (): number => {
        if (paymentType === PaymentTypes.PARTIAL) {
            return Number(order.amount) * 0.2;
        }
        if (paymentType === PaymentTypes.USDT) {
            if (isFloat(Number(order.amount) * 1.15)) {
                const num: any = Number(Number(order.amount) * 1.15);
                return num.toFixed(2);
            }
            return Number(order.amount) * 1.15;
        }
        return (order.amount) ? order.amount : 0;
    }
    
    const onPaymentClickHandler = () => {
        handleClose();
        setLoading(true);
        API.getPaymentLink(order.id, paymentType).then(response => {
            if (response.data.statusCode === 200) {
                window.location.href = response.data.content.PaymentLink;
            } else {
                setShowError({
                    show: true,
                    message: response.data.statusMessage,
                    title: t("paymentError")
                })
            }
        }).catch((error) => {
            if (error.response) {
                setShowError({
                    show: true,
                    message: error.response.data.statusMessage,
                    title: t("paymentError")
                })
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    const [showUsdtMessage, setShowUsdtMessage] = useState(false);

    function setUsdtTransaction(): void {
        API.paymentByUsdt(transactionCode).then(response => {
            setShowUsdtMessage(true);
        }).catch((error) => {
            if (error.response) {
                setShowError({
                    show: true,
                    message: error.response.data.statusMessage,
                    title: t("usdtPaymentError")
                })
            }
        })
    }

    return (
        <Page
            isSignInEnable={false}
            isSignOutEnable={true}
            paddingBottom={"0"}>
            <ProfileLayout>
                <Modal show={showError.show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>{showError.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{showError.message}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t("close")}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={(showError.title === t("paymentError")) ?
                            onPaymentClickHandler : (showError.title === t("usdtPaymentError")) ?
                            setUsdtTransaction : onApplyHandler}>
                        {t("tryAgain")}
                    </Button>
                    </Modal.Footer>
                </Modal>

                {
                    showUsdtMessage &&
                    <Modal show={true} onHide={() => setShowUsdtMessage(false)}>
                        <Modal.Header closeButton>
                        <Modal.Title>{t("usdtPayment")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{t("usdtPaymentMessage")}</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUsdtMessage(false)}>
                            {t("close")}
                        </Button>
                        </Modal.Footer>
                    </Modal>
                }

                {
                    (loadingCounter < 1) ?
                        <Ellipsis marginTop="50px"/>
                    :
                    (order.status === API.OrderStatus.WAITING_FOR_PAY) ?
                    <>
                        <Toaster ref={toasterRef}/>
                        <Row>
                            <Col
                                md={{span: 8, offset: 2}}
                                className={styles.complete_order_title}>
                                {t("waitingForPayDescription")}
                            </Col>
                        </Row>

                        <Line/>


                            <Row>
                                <Col md={12}>
                                    <div className={styles.total_container}>
                                        {t("totalOrder")} {order.amount} {t("euro")}
                                    </div>
                                </Col>
                            </Row>

                            {
                                <>
                                <Line/>
                                    <Row>
                                        <Col md={{span: 8, offset: 2}}  >
                                            <div className={styles.price_desc}>
                                                {t("paymentText")}
                                            </div>
                                            <div className={styles.payment_type}>
                                                <Row style={{width: "100%"}}>
                                                    <Col md={4} dir="auto" className={styles.payment_item}>
                                                        <FormCheck
                                                            onClick={
                                                                () => setPaymentType(PaymentTypes.OFFLINE)
                                                            }
                                                            checked={
                                                                paymentType === PaymentTypes.OFFLINE
                                                            }
                                                            name="payment_type"
                                                            id="offline-payment"
                                                            type="radio"></FormCheck>
                                                        <label
                                                            style={{marginTop: "4px"}}
                                                            htmlFor="offline-payment">
                                                                {t("offlinePayment")}
                                                        </label>
                                                    </Col>
                                                    <Col md={4} dir="auto" className={styles.payment_item}>
                                                        <FormCheck
                                                            readOnly
                                                            onClick={
                                                                () => setPaymentType(PaymentTypes.USDT)
                                                            }
                                                            checked={
                                                                paymentType === PaymentTypes.USDT
                                                            }
                                                            name="payment_type"
                                                            id="usdt-payment"
                                                            type="radio"></FormCheck>
                                                        <label
                                                            // onClick={
                                                            //     () => setPaymentType(PaymentTypes.USDT)
                                                            // }
                                                            style={{marginTop: "4px"}}
                                                            htmlFor="usdt-payment">
                                                                {t("usdtPayment")}
                                                        </label>
                                                    </Col>
                                                    <Col md={4} dir="auto" className={styles.payment_item}>
                                                        <FormCheck
                                                            readOnly
                                                            onClick={
                                                                () => setPaymentType(PaymentTypes.FULL)
                                                            }
                                                            checked={
                                                                paymentType === PaymentTypes.FULL
                                                            }
                                                            name="payment_type"
                                                            disabled={true}
                                                            id="full-payment"
                                                            type="radio"></FormCheck>
                                                        <label
                                                            style={{marginTop: "4px"}}
                                                            htmlFor="full-payment">
                                                                {t("fullPayment")}
                                                            </label>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div dir="auto" className={styles.price}>
                                                {t("payableAmount")} : <span dir="auto" style={{color: "#1a759f"}}>
                                                    {
                                                        getPaymentAmount()
                                                    } {(paymentType === PaymentTypes.USDT) ? t("usdt") : t("euro")}</span>
                                            </div>
                                            <div className={styles.payment_button}>
                                                {
                                                    (paymentType === PaymentTypes.OFFLINE) ?
                                                    <Button
                                                        disabled={loading}
                                                        onClick={() => setShowExchangeDetail(true)}
                                                        className={styles.payment_button_item}>
                                                        {
                                                            loading ?
                                                                <Spinner animation="border"/> :
                                                                t("offlineButton")
                                                        }
                                                    </Button>
                                                    :
                                                    (paymentType === PaymentTypes.USDT) ?
                                                    <></>
                                                    :
                                                    <Button
                                                        disabled={loading}
                                                        onClick={onPaymentClickHandler}
                                                        className={styles.payment_button_item}>
                                                        {
                                                            loading ?
                                                                <Spinner animation="border"/> :
                                                                t("pay")
                                                        }
                                                    </Button>
                                                }
                                            </div>
                                            {
                                                (paymentType === PaymentTypes.OFFLINE &&
                                                    showExchangeDetail) &&
                                                <div>
                                                    <div className={styles.price_desc}>
                                                        {t("offlineTitle")}
                                                    </div>
                                                    <CopyToClipboard
                                                        text={
                                                            (order.code) ?
                                                            order.code : ""
                                                        }
                                                        onCopy={
                                                            () => {
                                                                toasterRef.current?.onShowToaster(t("textCopied"))
                                                            }
                                                        }>
                                                        <div className={styles.copy_container}>
                                                            <div>{order.code}</div>
                                                            <div style={{marginLeft:"auto"}}>
                                                                <CopyIcon/>
                                                            </div>
                                                        </div>
                                                    </CopyToClipboard>
                                                </div>
                                            }
                                            {
                                                paymentType === PaymentTypes.USDT &&
                                                <>
                                                    {
                                                        (order.usdt_token) ?
                                                            <div style={{color: "orangered", fontWeight:"bold"}} className={styles.price_desc}>
                                                                {t("usdtPaymentMessage")}
                                                            </div>
                                                        :
                                                        <>
                                                            <div className={styles.price_desc}>
                                                                {t("usdtStep1Title")}<br></br><br></br>
                                                                {t("usdtStep1Text")}
                                                            </div>
                                                            <div className={styles.price_desc}>
                                                                {/*<img src={QrCode} style={{*/}
                                                                {/*    display: "block",*/}
                                                                {/*    width: "200px",*/}
                                                                {/*    height: "200px",*/}
                                                                {/*    margin: "auto"*/}
                                                                {/*}}/>*/}
                                                            </div>
                                                            <CopyToClipboard
                                                                text={
                                                                    "TUMLAZvL9cPZNq4AedS94hPp7dYwGwDAi3"
                                                                }
                                                                onCopy={
                                                                    () => {
                                                                        toasterRef.current?.onShowToaster(t("textCopied"))
                                                                    }
                                                                }>
                                                                <div className={styles.copy_container}>
                                                                    <div>TUMLAZvL9cPZNq4AedS94hPp7dYwGwDAi3</div>
                                                                    <div style={{marginLeft:"auto"}}>
                                                                        <CopyIcon/>
                                                                    </div>
                                                                </div>
                                                            </CopyToClipboard>
                                                            <div className={styles.price_desc}>
                                                                {t("usdtStep2Title")}<br></br><br></br>
                                                                {t("usdtStep2Text")}
                                                            </div>
                                                            <div className={styles.price_desc}>
                                                                <Row>
                                                                    <Col md={8}>
                                                                        <label
                                                                            className={baseStyles.input_label}
                                                                            htmlFor="basic-url">{t("transactionCode")}</label>
                                                                        <InputGroup className="mb-3">
                                                                            <FormControl
                                                                                value={transactionCode}
                                                                                name="transactionCode"
                                                                                onChange={(event) => setTransactionCode(event.target.value)}
                                                                                className={baseStyles.input}
                                                                                id="basic-url"
                                                                                aria-describedby="basic-addon3" />
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <Button
                                                                            style={{
                                                                                marginTop:"22px"
                                                                            }}
                                                                            onClick={() => setUsdtTransaction()}
                                                                            variant="primary">
                                                                            {t("iPaid")}
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </Col>
                                    </Row>
                                    {
                                        (paymentType === PaymentTypes.OFFLINE &&
                                            exhanges.length !== 0 && showExchangeDetail) &&
                                        <Row>
                                            <Col md={12}>
                                                {
                                                    loading ?
                                                        <Ellipsis marginTop="50px"/>
                                                        :
                                                        <Table
                                                            className={styles.exchange_table}
                                                            striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                <th>{t("name")}</th>
                                                                <th>{t("state")}</th>
                                                                <th>{t("address")}</th>
                                                                <th>{t("phoneNumber")}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    exhanges.map(exchange => (
                                                                        <tr key={exchange.id}>
                                                                            <td>{exchange.name}</td>
                                                                            <td>{exchange.state}</td>
                                                                            <td>{exchange.address}</td>
                                                                            <td>{exchange.phone}</td>
                                                                        </tr>
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </Table>
                                                }
                                            </Col>
                                        </Row>
                                    }
                                </>
                            }

                        {/* <Row>
                            <Col md={{span: 6, offset: 3}}>
                                <div>
                                    <CopyToClipboard
                                        text={
                                            (order.code) ?
                                            order.code : ""
                                        }
                                        onCopy={
                                            () => {
                                                toasterRef.current?.onShowToaster(t("textCopied"))
                                            }
                                        }>
                                        <div className={styles.copy_container}>
                                            <div>{order.code}</div>
                                            <div style={{marginLeft:"auto"}}>
                                                <CopyIcon/>
                                            </div>
                                        </div>
                                    </CopyToClipboard>
                                </div>
                            </Col>
                        </Row> */}
                    </>
                    :
                    <>
                        {/* Header */}
                        <Row>
                            <Col
                                md={{span: 8, offset: 2}}
                                className={styles.complete_order_title}>
                                {t("completeOrderDesc")}
                            </Col>
                        </Row>

                        <Line/>
                        {/* Person */}
                        {
                            order.persons.map((person, index) => (
                                <ContentCard
                                    uid={person.uuid}
                                    passportUrl={person.passport_image}
                                    key={index}
                                    isButtonEnable
                                    buttonText={t("uploadPassport")}
                                    margin="40px 10px"
                                    title={t("person") + " " + (index + 1)}
                                    actions={[]}
                                    contents={[
                                        {
                                            title: t("name"),
                                            value: person.name
                                        },
                                        {
                                            title: t("surname"),
                                            value: person.surname
                                        }
                                    ]}/>
                            ))
                        }
                        {/* Summery */}
                        <Line/>
                        <Row>
                            <Col className={styles.desc}>
                                {t("flightInfo")}<br></br>
                                {t("flightInfoContent")}<br></br>
                                <span className={styles.desc__bold}>{t("flightInfoNote")}</span>
                            </Col>
                        </Row>
                        {/* flight Info */}

                        <Row className={styles.flight_container}>
{/*
                            <Col md={4}>
                                <label
                                    className={baseStyles.input_label}
                                    htmlFor="basic-url">{t("flightNumber")}</label>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        value={flightForm.flightNumber}
                                        name="flightNumber"
                                        onChange={(event) => setFlightForm({
                                            ...flightForm,
                                            [event.target.name]: event.target.value
                                        })}
                                        className={baseStyles.input}
                                        id="basic-url"
                                        aria-describedby="basic-addon3" />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <label
                                    className={baseStyles.input_label}
                                    htmlFor="basic-url">{t("transportationCompany")}</label>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        value={flightForm.companyName}
                                        name="companyName"
                                        onChange={(event) => setFlightForm({
                                            ...flightForm,
                                            [event.target.name]: event.target.value
                                        })}
                                        className={baseStyles.input}
                                        id="basic-url"
                                        aria-describedby="basic-addon3" />
                                </InputGroup>
                            </Col>
*/}
                            <Col md={4}>
                                <label
                                    className={baseStyles.input_label}
                                    htmlFor="arrivalDate">{t("arrivalDate")}</label>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        onKeyUp={maskData}
                                        value={flightForm.arrivalDate}
                                        name="arrivalDate"
                                        onChange={(event) => setFlightForm({
                                            ...flightForm,
                                            [event.target.name]: event.target.value
                                        })}
                                        className={baseStyles.input}
                                        id="arrivalDate"
                                        placeholder="YYYY-MM-DD"
                                        maxLength={10}
                                        aria-describedby={t("arrivalDate")}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>

                        <Line/>
                        {/* Coupon */}

                        <Row>
                            {
                                coupons.map((item, index) => (
                                    <Col md={3} key={index * 14}>
                                        <label
                                            className={baseStyles.input_label}
                                            htmlFor="basic-url">{t("enterPin")}</label>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                value={item}
                                                placeholder={t("enterPin")}
                                                name="pin"
                                                onChange={(event) => {
                                                    const newCoupons = [...coupons];
                                                    newCoupons[index] = event.target.value;
                                                    setCoupons(newCoupons);
                                                }}
                                                className={baseStyles.input}
                                                id="basic-url"
                                                aria-describedby="basic-addon3" />
                                            <DeleteIcon onClick={() => {
                                                console.log(index)
                                                let newCoupons = [...coupons];
                                                newCoupons.splice(index, 1);
                                                console.log("new coupons", newCoupons)
                                                setCoupons(newCoupons);
                                            }} style={{margin:"7px",cursor:"pointer"}}/>
                                        </InputGroup>
                                    </Col>
                                ))
                            }
                            <Col md={3}>
                                <Button
                                    style={{marginTop: "23px"}}
                                    onClick={() => {
                                        let newCoupons = [...coupons];
                                        newCoupons.push("")
                                        setCoupons(newCoupons);
                                    }}
                                    variant="primary">
                                    {t("addCoupon")}
                                </Button>

                            </Col>
                        </Row>

                        <Line/>

                        <Row>
                            <Col md={{span:4, offset:4}}>
                                <Button onClick={() => onApplyHandler()} style={{width:"100%"}}>{t('applyCoupons')}</Button>
                            </Col>
                        </Row>

                        <Line/>
                        {/* Total Order */}

                        <Row>
                            <Col md={12}>
                                <div className={styles.total_container}>
                                    {t("totalOrder")} {(order.amount) ? order.amount - offAmount : ""} {t("euro")}
                                </div>
                            </Col>
                            {
                                offAmount !== 0 && <Col md={12} style={{marginTop: "10px", color: "green", fontWeight: "bold"}}>
                                    {t("offText1")} {offAmount} {t("euro")} {t("offText2")}
                                </Col>
                            }
                        </Row>
                        <Line/>
                        <Row>
                            <Col md={{span: 3, offset: 9}}>
                                <Button
                                    disabled={!isCompleteFormValid()}
                                    onClick={() => onFlighFormSubmitHandler()}
                                    style={{width: "100%", padding: "15px"}}>
                                    {
                                        loading ? <Spinner animation="border"/> : t("submit")
                                    }
                                </Button>
                            </Col>
                        </Row>

                    </>

                }
            </ProfileLayout>
        </Page>
    )
}

export default CompleteOrder;

