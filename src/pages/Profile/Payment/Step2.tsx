import React, {ReactElement, useEffect} from "react";
import {Button, Col, FormControl, InputGroup, Modal, Row} from "react-bootstrap";
import styles from "./Step2.module.css";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as API from "api";
import baseStyles from "../../../styles/base.module.css";
import {ReactComponent as DeleteIcon} from "../../../assets/delete_icon.svg";
import {ReactComponent as Plus} from "./../../../assets/icons/plus.svg";
import {ReactComponent as Right} from "./../../../assets/icons/right.svg";
import {FlightForm} from "../CompleteOrder/CompleteOrder";
import Toaster, { ToasterHandleMethods } from "components/Toaster/Toaster";
import {fetchOrder} from "../profileSlice";
import DatePicker from "react-datepicker";
import moment from "moment";
import {RootState} from "../../../store/store";

type PropsTypes = {
    onNext?: any,
    onBack?: any,
    onSetOff: any,
}

const Step2 = (props: PropsTypes): ReactElement => {

    const {t} = useTranslation();
    const dispatch = useDispatch();

    const [showError, setShowError] = useState({
        show: false,
        message: ""
    });

    const [confirm, setConfirm] = useState(false);

    const [isCoupons, setIsCoupons] = useState<boolean>(false);

    const [coupons, setCoupons] = useState<string[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [offAmount, setOffAmount] = useState<any>(false);

    const order = useSelector((state: RootState) => state.profile.order);

    const [flightForm, setFlightForm] = useState<FlightForm>({
        flightNumber: "",
        companyName: "",
        arrivalDate: ""
    });

    useEffect(()=>{
        props.onSetOff(offAmount)
    },[offAmount])

    function onApplyHandler(): boolean {

        if (isPinsEmpty())
            return false;
        API.applyCoupons({
            pins: coupons
        }).then(response => {
            setOffAmount(response.data.content.total_off);
            toasterRef.current?.onShowToaster(t('couponAddSuccess'),'success');
            return true
        }).catch(error => {
            setShowError({
                show: true,
                message: error.response.data.statusMessage
            })
            return false
        })
        return true
    }

    function isPinsEmpty(): boolean {
        if (coupons.length === 1 && coupons[0] == "") {
            setShowError({
                show: true,
                message: t("pleaseEnterPinValue")
            })
            return true;
        }
        let emptyPins = coupons.filter(pin => pin === "");
        if (emptyPins.length !== 0)
            setShowError({
                show: true,
                message: t("pleaseFillAllOpenedPins")
            })
        return emptyPins.length !== 0
    }
    const toasterRef = useRef<ToasterHandleMethods>(null);

    const renderCoupon = () => {
        return coupons.map((item, index) => (
            <Col md={4} key={index * 14}>
                <label
                    className={baseStyles.input_label}
                    htmlFor={`pin_${index}`}>{t("enterPin")}</label>
                <InputGroup className="mb-3">
                    <FormControl
                        value={item}
                        placeholder={t("enterPin")}
                        name={`pin_${index}`}
                        onChange={(event) => {
                            const newCoupons = [...coupons];
                            newCoupons[index] = event.target.value;
                            setCoupons(newCoupons);
                        }}
                        className={`${baseStyles.input} ${styles.flightInput}`}
                        id={`pin_${index}`}
                        aria-describedby={`pin_${index}`} />
                    <DeleteIcon onClick={() => removeCouponRow(index)} className={styles.couponIcons}/>
                    {index < order.data.persons.length - 1 && <Plus onClick={addCouponRow} className={styles.couponIconsAdd} />}
                    {index >= order.data.persons.length - 1 && <span className={styles.couponIconsAdd}/>}
                </InputGroup>
            </Col>
        ))
    }
    const addCouponRow = () => {
        if(coupons && coupons.length >= order.data.persons.length) return false
        setIsCoupons(true)
        const newCoupons = [...coupons];
        newCoupons.push("")
        setCoupons(newCoupons);
    }
    const removeCouponRow = (index:number) => {
        const newCoupons = [...coupons];
        newCoupons.splice(index, 1);
        setCoupons(newCoupons);
        if(!newCoupons.length) setIsCoupons(false)
    }
    const onFlightFormSubmitHandler = (): void => {
        setConfirm(false)
        let couponsData = [...coupons];
        if(!flightForm.arrivalDate || flightForm.arrivalDate.length < 10) {
            toasterRef.current?.onShowToaster(t("checkinDateRequired"),'error')
            return
        }
        const pinvalid = coupons.length < 1 ? true : onApplyHandler()
        if(!pinvalid) return;

        setLoading(true);
        API.completeOrder(flightForm, couponsData).then( () => {
            dispatch(fetchOrder());
            props.onNext()
        }).finally(() => {
            setLoading(false);
        })
    }
    /*
        handle close show error modal
     */
    const handleCloseError = () => {
        setShowError({
            show: false,
            message: ""
        })
    }
    return (
        <>
            <Toaster ref={toasterRef}/>
            <Modal show={showError.show} onHide={handleCloseError}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("pinVerificationFailed")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{showError.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleCloseError}>
                        {t("close")}
                    </Button>
                    <Button variant="primary" onClick={onApplyHandler}>
                        {t("tryAgain")}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={confirm} onHide={() => setConfirm(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>{t("finalize")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('confirmOrder')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setConfirm(false)}>
                        {t("close")}
                    </Button>
                    <Button variant="success" onClick={onFlightFormSubmitHandler}>
                        {t("ImSure")}
                    </Button>
                </Modal.Footer>
            </Modal>

            <>
                <div className={styles.flight_container_title}>
                    {t('enterTravelInformation')}
                </div>

                <Row className={styles.flight_container}>

                    <Col md={5} xs={12}>
                        <label
                            className={baseStyles.input_label}
                            htmlFor="arrivalDate"
                        >
                            {t("arrivalDate")} <span className={baseStyles.input_label_required}>*</span>
                        </label>
                        <InputGroup className="mb-3">
                            <DatePicker
                                selected={flightForm.arrivalDate ? moment(flightForm.arrivalDate).toDate() : undefined}
                                name="arrivalDate"
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                maxDate={moment().add(45,'d').toDate()}
                                showMonthDropdown
                                showYearDropdown
                                showPopperArrow={false}
                                onChange={(date) => {
                                    setFlightForm({
                                        ...flightForm,
                                        ['arrivalDate']: moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : ''
                                    })
                                }}
                                autoComplete="off"
                                className={`${baseStyles.input} form-control`}
                                id="arrivalDate"
                            />

                        </InputGroup>
                    </Col>
                </Row>
                {!isCoupons &&
                    <Row>
                        <Col>
                            <span onClick={addCouponRow} className={styles.isCouponsLabel}>{t('HaveACoupon')}</span>
                        </Col>
                    </Row>
                }
                {isCoupons &&
                    <Row className={styles.flight_container} style={{paddingBottom: 60,maxHeight: order.data.persons.length / 2 * 100, minHeight: 100}}>
                        {renderCoupon()}
                    </Row>
                }
                {isCoupons && <Button onClick={() => onApplyHandler()} className={styles.applyCoupon}>{t('applyCoupons')}</Button>}
            </>
            <div className={styles.actionHolder}>
                <Button onClick={props.onBack} variant="outline-dark"> <Right className={styles.rightIcon} /> {t('editGuests')}</Button>

                <Button
                    className={styles.next_step}
                    onClick={() => setConfirm(true)}
                    variant="primary"
                >
                    {t('finalizeOrder')}
                </Button>
            </div>
        </>
    )
}

export default Step2;
