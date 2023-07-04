import React, { ReactElement, Ref } from "react";
import { Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import styles from "./PersonInformation.module.css";
import baseStyles from "styles/base.module.css";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";
import { PersonFormData } from "pages/Order/orderSlice";
import { useImperativeHandle } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { countries, getCountryName } from "components/PersonCard/countries";
import DatePicker from "react-datepicker";
import moment from 'moment'
import {isValidEnglish} from "../../utils/base";

type PersonInformationProps = {
    personInitialData: PersonFormData
}

export type PersonInformationHandleMethods = {
    getPersonForm: () => PersonFormData,
    isValid: any
}

const PersonInformation = ({personInitialData}: PersonInformationProps,
    ref: Ref<PersonInformationHandleMethods>): ReactElement => {

    const {t} = useTranslation();
    
    const [countryOptions, setCountryOptions] = useState<string[]>([]);

    const [personForm, setPersonForm] = useState<PersonFormData>({
        birthCountry: "",
        birthDate: "",
        gender: "",
        name: "",
        nationalId: "",
        nationality: "",
        passportExpiry: "",
        passportNumber: "",
        surname: ""
    })

    useImperativeHandle(ref, () => ({
        getPersonForm(): PersonFormData {
            return personForm;
        },
        isValid: () => isValid()
    }));

    useEffect(() => {
        const personalData = {...personInitialData};
        personalData.nationality = getCountryName(personalData.nationality);
        personalData.birthCountry = getCountryName(personalData.birthCountry);
        setPersonForm(personalData);
        setCountryOptions(countries.map(item => item.name));
    }, [])
    const onPersonChangeHandler = (name: string, value: string) => {
        //check for non english and "-", "," and "space"
        if(value && !isValidEnglish(value)) return false
        setPersonForm({
            ...personForm,
            [name]: value
        })
    }
    const isValid = ():any => {
        let validity:any = true;
        const getKeys = Object.keys(personForm) as Array<keyof typeof personForm>

        getKeys.forEach((key) => {
            if(key !== "passport_image"){
                if(key === 'nationalId' && personForm['nationality'] === 'Iran, Islamic Republic of Iran'){
                    if(personForm[key] === '' || personForm[key] === null || personForm[key].length < 10){
                        validity = false
                    }
                }

                if(key !== 'nationalId' && (personForm[key] === '' || personForm[key] === null)){
                    validity = false
                }
            }

        })
        return validity;
    }

    return <div className={styles.mainHolder}>
        <Row>
            <Col className={styles.person_info_title} md={12}>
                {t("personInfo")}
            </Col>
            <Col md={4}>
                <label
                    className={baseStyles.input_label}
                    htmlFor="basic-url">{t("name")}</label>
                <InputGroup className="mb-3">
                    <FormControl
                        value={personForm.name}
                        name="name"
                        onChange={(event) => onPersonChangeHandler(event.target.name, event.target.value)}
                        className={baseStyles.input}
                        id="basic-url"
                        aria-describedby="basic-addon3" />
                </InputGroup>
            </Col>
            <Col md={4}>
                <label
                    className={baseStyles.input_label}
                    htmlFor="basic-url">{t("surname")}</label>
                <InputGroup className="mb-3">
                    <FormControl
                        value={personForm.surname}
                        name="surname"
                        onChange={(event) => onPersonChangeHandler(event.target.name, event.target.value)}
                        className={baseStyles.input}
                        id="basic-url"
                        aria-describedby="basic-addon3" />
                </InputGroup>
            </Col>
            <Col md={4}>
                <label
                    className={baseStyles.input_label}
                    htmlFor="basic-url">{t("gender")}</label>
                <InputGroup className="mb-3">
                    <FormControl
                        value={personForm.gender}
                        name="gender"
                        onChange={(event) => onPersonChangeHandler(event.target.name, event.target.value)}
                        className={baseStyles.select}
                        as="select"
                    >
                        <option>{t("selectGender")}</option>
                        <option value="1">{t("men")}</option>
                        <option value="2">{t("women")}</option>
                    </FormControl>
                </InputGroup>
            </Col>
            <Col md={4}>
                <label
                    className={baseStyles.input_label}
                    htmlFor="nationality">{t("nationality")}</label>
                <div className="mb-3">

                    <Typeahead
                        defaultInputValue={getCountryName(personInitialData.nationality)}
                        id={"1"}
                        inputProps={{
                            className: baseStyles.input,
                            name: "nationality"
                        }}
                        onChange={(selected: string[]) => onPersonChangeHandler("nationality", selected[0])}
                        options={countryOptions}
                        clearButton
                    />
                </div>
            </Col>
            <Col md={4}>
                <label
                    className={baseStyles.input_label}
                    htmlFor="basic-url">{t("passportNo")}</label>
                <InputGroup className="mb-3">
                    <FormControl
                        value={personForm.passportNumber}
                        name="passportNumber"
                        onChange={(event) => setPersonForm({
                            ...personForm,
                            [event.target.name]: event.target.value
                        })}
                        className={baseStyles.input}
                        id="basic-url"
                        aria-describedby="basic-addon3"
                    />
                </InputGroup>
            </Col>
            <Col md={4}>
                <label
                    className={baseStyles.input_label}
                    htmlFor="passportExpiry"
                >
                    {t("passportExp")}
                </label>
                <InputGroup className="mb-3">
                    <DatePicker
                        selected={personForm.passportExpiry ? moment(personForm.passportExpiry).toDate() : new Date()}
                        name="passportExpiry"
                        dateFormat="yyyy-MM-dd"
                        minDate={moment().add(40,'d').toDate()}
                        showMonthDropdown
                        showYearDropdown
                        onChange={(date) => {
                            setPersonForm({
                                ...personForm,
                                ['passportExpiry']: moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : ''
                            })
                        }}
                        className={`${baseStyles.input} form-control`}
                        id="passportExpiry"
                        autoComplete="nope"
                    />

                </InputGroup>
            </Col>
            <Col md={4}>
                <label
                    className={baseStyles.input_label}
                    htmlFor="birthDate"
                >
                    {t("birthDate")}
                </label>
                <InputGroup className="mb-3">
                    <DatePicker
                        selected={personForm.birthDate ? moment(personForm.birthDate).toDate() : new Date()}
                        name="birthDate"
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        onChange={(date) => {
                            setPersonForm({
                                ...personForm,
                                ['birthDate']: moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : ''
                            })
                        }}
                        className={`${baseStyles.input} form-control`}
                        id="birthDate"
                        autoComplete="nope"
                    />

                </InputGroup>
            </Col>
            <Col md={4}>
                <label
                    className={baseStyles.input_label}
                    htmlFor="basic-url">{t("birthCountry")}</label>
                <div className="mb-3">

                <Typeahead
                    defaultInputValue={getCountryName(personInitialData.birthCountry)}
                    id={"1"}
                    inputProps={{
                        className: baseStyles.input,
                        name: "birthCountry"
                    }}
                    onChange={(selected: string[]) => onPersonChangeHandler("birthCountry", selected[0])}
                    options={countryOptions}
                />
                </div>
            </Col>
            {personForm.nationality === "Iran, Islamic Republic of Iran" &&
                <Col md={4}>
                    <label className={baseStyles.input_label} htmlFor="nationalId">{t("nationalID")}</label>
                    <InputGroup className="mb-3">
                        <FormControl
                            value={personForm.nationalId}
                            name="nationalId"
                            onChange={(event) => onPersonChangeHandler(event.target.name, event.target.value)}
                            className={baseStyles.input}
                            id="nationalId"
                            aria-describedby="basic-addon3"
                            type="number"
                        />
                    </InputGroup>
                </Col>
            }

        </Row>
    </div>
}

export default forwardRef(PersonInformation);
