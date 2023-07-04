import React, { ReactElement, useEffect, useState } from "react";
import Page from "components/Page/Page";
import { Button, Col, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import OrderLayout from "../OrderLayout/OrderLayout";
import baseStyles from "styles/base.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { ContactFormData, contactInitialForm, setContact } from "../orderSlice";
import { RouteComponentProps } from "react-router-dom";
import * as Api from "api";
import { useTranslation } from "react-i18next";
import { Typeahead } from "react-bootstrap-typeahead";
import { countries, getCountryCode, getCountryDialCode } from "components/PersonCard/countries";
// @ts-ignore
import ReactCountryFlag from "react-country-flag"

import {ReactComponent as ArrowDown} from "./assets/arrow_down.svg";
import Popup from "components/Popup/Popup";
import styles from "../VaccineForm/VaccineForm.module.css";
import {HotelPackageApi} from "api";
import {isValidEmailType, isValidEmail} from "../../../utils/base";

type ContactFormProps = {} & RouteComponentProps

function ContactForm(props: ContactFormProps): ReactElement {

    const {t, i18n} = useTranslation();

    const registration = useSelector((state: RootState) => state.registration);

    const [countryOptions, setCountryOptions] = useState<string[]>([]);

    const [countryName, setCountryName] = useState<any>(registration?.persons[0].nationality ? [registration?.persons[0].nationality] : ['Iran, Islamic Republic of Iran']);

    const [isCountryPopupOpen, setIsCountryPopupOpen] = useState<boolean>(false);

    const dispatch = useDispatch();

    const personData = useSelector((state: RootState) => state.registration.persons);

    const contact = useSelector((state: RootState) => state.registration.contact)


    const [contactForm, setContactForm] = useState<ContactFormData>(contactInitialForm);

    const [loading, setLoading] = useState<boolean>(false);

    const [groupedPackages, setGroupedPackages] = useState(new Map());

    const [showError, setShowError] = useState({
        show: false,
        message: "",
        code: 0,
    });

    useEffect(() => {
        //check for data
        const {vaccine, persons} = registration;
        if(!persons || persons?.length < 1 || !persons[0]?.name || persons[0]?.name === '') props.history.replace('/order/person')
        if(!vaccine || !vaccine?.package_uid || vaccine?.package_uid === '') props.history.replace('/order/person')

        let newContact = {...contact};
        newContact.country = registration?.persons[0].nationality;
        setContactForm(newContact);
        setCountryOptions(countries.map(item => item.name));


        Api.fetchPackages(personData.length).then(response => {
            let groupedData = response.data.content.reduce((r: any, a: any) => {
                r[a.nights_num] = [...r[a.nights_num] || [], a];
                return r;
            }, {});
            const mapGroupedData: any = new Map(Object.entries(groupedData));
            setGroupedPackages(mapGroupedData);
        })

    }, [])

    const onSignUpClickHandler = () => {
        //check email validation
        if(!isValidEmail(contactForm.email)) {
            setShowError({
                show: true,
                message: t('emailIsNotValid'),
                code: 401
            })
            return false;
        }
        //check if mobile enter and length shall between 5 ~ 15
        if(!contactForm.phoneNumber || contactForm.phoneNumber.length < 5  || contactForm.phoneNumber.length > 15) {
            setShowError({
                show: true,
                message: t('phoneNumberIsNotValid'),
                code: 401
            })
            return false;
        }
        //check if country IR and shall enter link 9120000000
        if (getCountryCode(contactForm.country) === 'IR' && (contactForm.phoneNumber.match(/^[9]{1}[0-9]{9}$/) === null && contactForm.phoneNumber.match(/^[0]{1}[9]{1}[0-9]{9}$/) === null)){
            setShowError({
                show: true,
                message: t('phoneNumberIsNotValid'),
                code: 401
            })
            return false;
        }
        if(contactForm.phoneNumber.match(/^[0]{1}[9]{1}[0-9]{9}$/) !== null) contactForm.phoneNumber = contactForm.phoneNumber.substr(1)
        dispatch(setContact(contactForm));
        let registrationData = {...registration};
        registrationData.contact = {...contactForm};
        registrationData.contact.phoneNumber = getCountryDialCode(contactForm.country) +
            contactForm.phoneNumber;
        handleClose();
        setLoading(true);
        Api.registration(registrationData).then(response => {
            if (response.data.statusCode === 200) {
                props.history.push("/order/result");
            } else {
                setShowError({
                    show: true,
                    message: response.data.statusMessage,
                    code: response.data.statusCode
                })
            }
        }).catch(error => {
            if (error.response) {
                setShowError({
                    show: true,
                    message: error.response.data.statusMessage,
                    code: error.response.data.statusCode
                })
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleClose = () => {
        setShowError({
            show: false,
            message: "",
            code: 0
        });
    }
    /*
        * valid email
     */
    const handleNextEnabled = ():boolean => {
        //check form valid
        if (String(contactForm.email).toLowerCase().match(/\S+@\S+\.\S+/) && (contactForm.phoneNumber && contactForm.phoneNumber.length)){
            return false
        }
        return true
    }

    function getSelectedHotel():HotelPackageApi | any{
        return groupedPackages.get(registration.vaccine.selected_night)?.find((hotel: HotelPackageApi) => hotel.uuid === registration.vaccine.package_uid)
    }
    /*
        * on change email
        * params: email
     */
    const onChangeEmail = (value:string) => {
        if(isValidEmailType(value)) setContactForm({
            ...contactForm,
            email: value.toLowerCase()
        })
    }

    const goToLogin = () => props.history.push('/auth/otp');
    const fallBackLang = function (lang:string){
        return lang === 'es' ? 'en' : lang
    }

    return (
        <Page>
            <OrderLayout
                isLoading={loading}
                clearText={t("back")}
                enableSteps={["1", "2", "3"]}
                onClearClick={() => props.history.push("/order/vaccine")}
                onNextClick={onSignUpClickHandler}
                disableNextButton={handleNextEnabled()}
            >
                    <div className={styles.container}>
                        <Modal show={showError.show} onHide={handleClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>{t("registrationFailed")}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{showError.message}</Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                {t("close")}
                            </Button>
                            <Button variant="primary" onClick={showError.code === 400 ? goToLogin : onSignUpClickHandler}>
                                {showError.code === 400 ? t("login") : t("tryAgain")}
                            </Button>
                            </Modal.Footer>
                        </Modal>
                        {
                            isCountryPopupOpen &&
                            <Popup
                                width={window.outerWidth < 768 ? '100%' : '25%'}
                                onCancelClick={() => {
                                    setCountryName("");
                                    setIsCountryPopupOpen(false);
                                }}
                                onSubmitClick={() => {
                                setContactForm({
                                    ...contactForm,
                                    "country": countryName
                                });
                                setIsCountryPopupOpen(false);
                                }}
                            submitText={t("select")}
                            disabled={!countryName}
                            >
                            <Row>
                                <Col md={{span: 10, offset: 1}}>
                                    <div>
                                        <Typeahead
                                            id={"1"}
                                            defaultSelected={registration?.persons[0].nationality ? [registration?.persons[0].nationality] : ['Iran, Islamic Republic of Iran']}
                                            inputProps={{
                                                name: "country",
                                                placeholder: t("countryPlacholder"),
                                            }}
                                            onChange={(selected: string[]) =>
                                                setCountryName(selected[0])
                                            }
                                            clearButton={true}
                                            options={countryOptions}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Popup>
                        }
                        <Row className="mb-5">
                            <Col md={{ span: 5}}>
                                <div className={styles.title}>
                                    {t('enterYourContactInfo')}
                                </div>
                                <div className="ltr">
                                        <label
                                            className={baseStyles.input_label}
                                            htmlFor="phone"
                                        >
                                            {t("phoneNumber")}
                                        </label>
                                        <InputGroup className="mb-5">
                                            <InputGroup.Prepend className={styles.prepend}>
                                                <InputGroup.Text
                                                    style={{cursor: "pointer"}}
                                                    onClick={() => {
                                                        setIsCountryPopupOpen(true);
                                                    }}
                                                    id="phone">
                                                    <ReactCountryFlag
                                                        style={{
                                                            width:"20px",
                                                            height:"20px"}}
                                                        countryCode={getCountryCode(contactForm.country)} svg/>
                                                    <div style={{fontSize:"10px",padding:"3px"}}>
                                                        {getCountryDialCode(contactForm.country)}
                                                    </div>
                                                    <ArrowDown/>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                value={contactForm.phoneNumber}
                                                name="phoneNumber"
                                                onChange={(event) => setContactForm({
                                                    ...contactForm,
                                                    phoneNumber: event.target.value
                                                })}
                                                className={`${baseStyles.input} ${styles.input}`}

                                                id="phone"
                                                type="number"
                                                aria-describedby="phone" />

                                        </InputGroup>
                                </div>
                                <div>
                                    <label
                                        className={baseStyles.input_label}
                                        htmlFor="email"
                                    >
                                        {t("email")}
                                    </label>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            value={contactForm.email}
                                            name="email"
                                            onChange={(event) => onChangeEmail(event.target.value)}
                                            className={`${baseStyles.input} ${styles.input}`}
                                            id="email"
                                            aria-describedby="email" />
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col/>
                            <Col md={5}>
                                {/*Summery Table*/}
                                <div>
                                    {(groupedPackages && registration.vaccine.package_uid && getSelectedHotel()) && (
                                        <div className={styles.summeryPanelHolder}>
                                            <div className={styles.fullPrice}>
                                                {t("€")}{(getSelectedHotel()) ? getSelectedHotel().price : ""}
                                            </div>
                                            <div className={styles.personPrice}>
                                                {t("€")}{(getSelectedHotel()) ? (getSelectedHotel().price / personData.length).toFixed(2) : ""} <span>{t('perPerson')}</span>
                                            </div>
                                            <div className={styles.summeryTable}>
                                                <div className={styles.summeryBar}>
                                                    <div className={styles.summeryRow}>
                                                        <div className={styles.summeryItemFirst}>
                                                            <label className={styles.summeryItemLabel}>
                                                                <div className={styles.summeryItemLabelField}>
                                                                    {t('stayingAt')}
                                                                </div>
                                                                <div className={styles.summeryItemLabelValue}>
                                                                    {getSelectedHotel().hotel_name}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className={styles.summeryRow}>
                                                        <div className={styles.summeryItem}>
                                                            <label className={styles.summeryItemLabel}>
                                                                <div className={styles.summeryItemLabelField}>
                                                                    {t('duration')}
                                                                </div>
                                                                <div className={styles.summeryItemLabelValue}>
                                                                    {String(getSelectedHotel().nights_num) === "0" ? t('withoutHotel') : `${getSelectedHotel().nights_num} ${t('night(s)')}`}
                                                                </div>
                                                            </label>
                                                            <div className={styles.summeryItemLabelSep}/>
                                                            <label className={styles.summeryItemLabel}>
                                                                <div className={styles.summeryItemLabelField}>
                                                                    {t('rooms')}
                                                                </div>
                                                                <div className={styles.summeryItemLabelValue}>
                                                                    {getSelectedHotel()['room_type_' + fallBackLang(i18n.language)]}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className={styles.summeryRow}>
                                                        <div className={styles.summeryItem}>
                                                            <label className={styles.summeryItemLabel}>
                                                                <div className={styles.summeryItemLabelField}>
                                                                    {t('description')}
                                                                </div>
                                                                <div className={styles.summeryItemLabelValue}>
                                                                    {getSelectedHotel()['desc_' + fallBackLang(i18n.language)]}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className={styles.summeryRow}>
                                                        <div className={styles.summeryItemLast}>
                                                            <label className={styles.summeryItemLabel}>
                                                                <div className={styles.summeryItemLabelField}>
                                                                    {t('address')}
                                                                </div>
                                                                <div className={styles.summeryItemLabelValue}>
                                                                    {getSelectedHotel()['address_' + fallBackLang(i18n.language)]}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </Col>
                        </Row>
                    </div>
            </OrderLayout>
        </Page>
    )
}

export default ContactForm;
