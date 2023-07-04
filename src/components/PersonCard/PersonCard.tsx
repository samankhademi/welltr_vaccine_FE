import React, { forwardRef, ReactElement } from "react";
import { Col, Container, FormControl, FormText, InputGroup, Row } from "react-bootstrap";
import styles from "./PersonCard.module.css";
import baseStyles from "styles/base.module.css";
import { PersonFormData } from "pages/Order/orderSlice";
import { useTranslation } from "react-i18next";
import { Typeahead } from 'react-bootstrap-typeahead';
import { countries } from "./countries";
import { useState } from "react";
import { useEffect } from "react";
import { getDirectionByLang } from "utils/base";
import { useRef } from "react";
import { useImperativeHandle } from "react";
import DatePicker from "react-datepicker";
import moment from 'moment';
import "../../assets/datepicker.module.css";
import "react-datepicker/dist/react-datepicker.css";

type PersonCardProps = {
    number: number,
    onPersonChange: (fieldName: string, value: string) => void,
    onRemove: () => void,
    person: PersonFormData,
    validationErrors?: ValidationError[],
    showErrors: boolean
}

export enum ValidationTypes {
    EMPTY = "EMPTY",
    CUSTOME = "CUSTOME"
}

export type ValidationError = {
    fieldName: string,
    isValid: boolean,
    validationType: ValidationTypes
}
function PersonCard(props: PersonCardProps, ref: any): ReactElement {

    const [countryOptions, setCountryOptions] = useState<string[]>([]);

    const {t, i18n} = useTranslation();

    const nationalityRef = useRef<any>(null);

    const birthCountryRef = useRef<any>(null);

    useEffect(() => {
        setCountryOptions(countries.map(item => item.name));
    }, []);

    useImperativeHandle(ref, () => ({
        clearCountryInput: () => {
            nationalityRef.current?.clear();
            birthCountryRef.current?.clear();
        }
    }))

    const getValidationItem = (fieldName: string): ValidationError => {
        const validationItem =  props.validationErrors?.find(item => item.fieldName === fieldName);
        if (validationItem)
            return validationItem;
        return {
            fieldName: "",
            isValid: true,
            validationType: ValidationTypes.EMPTY
        }
    }

    return <Container>
        <Row>
            <Col>
                <p className={styles.person_title}>
                    {t("person")} {props.number}
                </p>
            </Col>
        </Row>
        <Row>
            <Col
                style={{direction: getDirectionByLang(i18n.language)}}
                className={styles.person_form_container}>
                <Row>
                    <Col md={3}>
                        <label
                            className={baseStyles.input_label}
                            htmlFor="basic-url">{t("name")}</label>
                        <InputGroup className="mb-3">
                            <FormControl
                                value={props.person.name}
                                name="name"
                                onChange={(event) => props.onPersonChange(
                                    event.target.name, event.target.value)}
                                className={` ${baseStyles.input}`}
                                id="basic-url"
                                aria-describedby="basic-addon3"
                                autoComplete="nope"
                            />
                        </InputGroup>
                        {
                            (props.showErrors && !getValidationItem("name").isValid) &&
                            <FormText className={baseStyles.input_text}>
                                {
                                    t("emptyValidation")
                                }
                            </FormText>
                        }
                    </Col>
                    <Col md={3}>
                        <label
                            className={baseStyles.input_label}
                            htmlFor="surname">{t("surname")}</label>
                        <InputGroup className="mb-3">
                            <FormControl
                                value={props.person.surname}
                                name="surname"
                                onChange={(event) => props.onPersonChange(
                                    event.target.name, event.target.value)}
                                className={` ${baseStyles.input}`}
                                id="surname"
                                aria-describedby="surname"
                                autoComplete="nope"
                            />
                        </InputGroup>
                        {
                            (props.showErrors && !getValidationItem("surname").isValid) &&
                            <FormText className={baseStyles.input_text}>
                                {
                                    t("emptyValidation")
                                }
                            </FormText>
                        }
                    </Col>
                    <Col md={3}>
                        <label
                            className={baseStyles.input_label}
                            htmlFor="gender">{t("gender")}</label>
                        <InputGroup className="mb-3">
                            <FormControl
                                value={props.person.gender}
                                name="gender"
                                id="gender"
                                onChange={(event) => props.onPersonChange(
                                    event.target.name, event.target.value)}
                                className={` ${baseStyles.select}`}
                                as="select">
                                <option value="">{t("selectGender")}</option>
                                <option value="1">{t("men")}</option>
                                <option value="2">{t("women")}</option>
                            </FormControl>
                        </InputGroup>
                        {
                            (props.showErrors && !getValidationItem("gender").isValid) &&
                            <FormText className={baseStyles.input_text}>
                                {
                                    t("emptyValidation")
                                }
                            </FormText>
                        }
                    </Col>
                    <Col md={3}>
                        <label
                            className={baseStyles.input_label}
                            htmlFor="nationality">{t("nationality")}</label>
                        <Typeahead
                            ref={nationalityRef}
                            defaultInputValue={props.person.nationality}
                            id={"1"}
                            inputProps={{
                                className: ` ${baseStyles.input}`,
                                name: "nationality",
                                style: {marginBottom:"1rem"}
                            }}
                            onChange={(selected: string[]) => {
                                props.onPersonChange("nationality", selected[0]);
                            }}
                            options={countryOptions}
                        />
                        {
                            (props.showErrors && !getValidationItem("nationality").isValid) &&
                            <FormText className={baseStyles.input_text}>
                                {
                                    t("emptyValidation")
                                }
                            </FormText>
                        }
                    </Col>
                    <Col md={3}>
                        <label
                            className={baseStyles.input_label}
                            htmlFor="passportNumber">{t("passportNo")}</label>
                        <InputGroup className="mb-3">
                            <FormControl
                                value={props.person.passportNumber}
                                name="passportNumber"
                                onChange={(event) => props.onPersonChange(
                                    event.target.name, event.target.value)}
                                className={` ${baseStyles.input}`}
                                id="passportNumber"
                                aria-describedby="passportNumber"
                                autoComplete="nope"
                            />
                        </InputGroup>
                        {
                            (props.showErrors && !getValidationItem("passportNumber").isValid) &&
                            <FormText className={baseStyles.input_text}>
                                {
                                    t("emptyValidation")
                                }
                            </FormText>
                        }
                    </Col>
                    <Col md={3}>
                        <label
                            className={baseStyles.input_label}
                            htmlFor="passportExpiry"
                        >
                            {t("passportExp")}
                        </label>
                        <InputGroup className="mb-3">
                            <DatePicker
                                selected={props.person.passportExpiry && props.person.passportExpiry !== '' ? moment(props.person.passportExpiry).toDate() : undefined}
                                name="passportExpiry"
                                dateFormat="yyyy-MM-dd"
                                minDate={moment().add(41,'d').toDate()}
                                showMonthDropdown
                                showYearDropdown
                                showPopperArrow={false}
                                onChange={(date) => {
                                    props.onPersonChange('passportExpiry', moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : '')
                                }}
                                className={` ${baseStyles.input} form-control`}
                                id="passportExpiry"
                                autoComplete="nope"
                            />
                        </InputGroup>
                        {
                            (props.showErrors && !getValidationItem("passportExpiry").isValid) &&
                            <FormText className={baseStyles.input_text}>
                                {
                                    getValidationItem("passportExpiry").validationType === ValidationTypes.EMPTY ?
                                        t("emptyValidation") : t("passportExpiryValidation")
                                }
                            </FormText>
                        }
                    </Col>
                    <Col md={3}>
                        <label
                            className={baseStyles.input_label}
                            htmlFor="birthDate"
                        >
                            {t("birthDate")}
                        </label>
                        <InputGroup className="mb-3">
                            <DatePicker
                                selected={props.person.birthDate && props.person.birthDate !== '' ? moment(props.person.birthDate).toDate() : undefined}
                                name="birthDate"
                                dateFormat="yyyy-MM-dd"
                                maxDate={new Date()}
                                showMonthDropdown
                                showYearDropdown
                                showPopperArrow={false}
                                onChange={(date) => {
                                    props.onPersonChange('birthDate', moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : '')
                                }}
                                className={` ${baseStyles.input} form-control`}
                                id="birthDate"
                                autoComplete="nope"

                            />
                        </InputGroup>
                        {
                            (props.showErrors && !getValidationItem("birthDate").isValid) &&
                            <FormText className={baseStyles.input_text}>
                                {
                                    (getValidationItem("birthDate").validationType === ValidationTypes.EMPTY) ?
                                        t("emptyValidation") : t("birthDateValidation")
                                }
                            </FormText>
                        }
                    </Col>
                    <Col md={3}>
                        <label
                            className={baseStyles.input_label}
                            htmlFor="birthCountry">{t("birthCountry")}</label>
                        <Typeahead
                            ref={birthCountryRef}
                            defaultInputValue={props.person.birthCountry}
                            id={"1"}
                            inputProps={{
                                className: ` ${baseStyles.input}`,
                                name: "birthCountry",
                                style: {marginBottom:"1rem"}
                            }}
                            onChange={(selected: string[]) => {
                                props.onPersonChange("birthCountry", selected[0]);
                            }}
                            options={countryOptions}/>
                        {
                            (props.showErrors && !getValidationItem("birthCountry").isValid) &&
                            <FormText className={baseStyles.input_text}>
                                {
                                    t("emptyValidation")
                                }
                            </FormText>
                        }
                    </Col>
                    <Col md={3}>
                        {
                            props.person.nationality === "Iran, Islamic Republic of Iran" &&
                            <>
                                <label
                                    className={baseStyles.input_label}
                                    htmlFor="nationalId"
                                >{t("nationalID")}</label>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        value={props.person.nationalId}
                                        type="number"
                                        name="nationalId"
                                        onChange={(event) => props.onPersonChange(
                                            event.target.name, event.target.value)}
                                        className={` ${baseStyles.input}`}
                                        id="nationalId"
                                        aria-describedby="nationalId"
                                        autoComplete="nope"
                                    />
                                </InputGroup>
                                {
                                    (props.showErrors && !getValidationItem("nationalId").isValid) &&
                                    <FormText className={baseStyles.input_text}>
                                        {
                                            (getValidationItem("nationalId").validationType === ValidationTypes.EMPTY) ?
                                                t("emptyValidation") : t("nationalIdValidation")
                                        }
                                    </FormText>
                                }
                            </>
                        }
                    </Col>
                    {props.number !== 1 && <button className={`${styles.removePersonIcon} removePersonIcon`} onClick={props.onRemove}>x {t('delete')}</button>}
                </Row>
            </Col>
        </Row>
    </Container>
}

export default forwardRef(PersonCard);
