import React, { ReactElement, useState, useEffect, createRef } from "react";
import Page from "components/Page/Page";
import OrderLayout from "../OrderLayout/OrderLayout";
import { Col, Container, Row } from "react-bootstrap";
import PersonCard, { ValidationError, ValidationTypes } from "components/PersonCard/PersonCard";
import AddPersonButton from "components/AddPersonButton/AddPersonButton";
import { useDispatch, useSelector } from "react-redux";
import { setPersons, PersonFormData, personInitialForm, initPersons } from "../orderSlice";
import { RootState } from "store/store";
import { RouteComponentProps } from "react-router-dom";
import { useTranslation } from "react-i18next";
import baseStyles from "styles/base.module.css";
import { birthDateValidation, emptyValidation, nationalIdValidation, passportExpiryValidation } from "utils/base";
import { getCountryName } from "components/PersonCard/countries";
import { personFormCustomValidationFields } from "configs/validations";
import {isValidEnglish} from "utils/base";

type PersonFormProps = {} & RouteComponentProps;

function PersonForm(props: PersonFormProps): ReactElement {

    const {t} = useTranslation();

    const dispatch = useDispatch();

    const persons = useSelector((state: RootState) => state.registration.persons);

    const [personFormData, setPersonFormData] = useState<PersonFormData[]>([]);

    const [personErrors, setPersonErrors] = useState<Map<number, ValidationError[]>>();

    const [showErrors, setShowErrors] = useState<boolean>(false);

    const [personCardRefs, setPersonCardRefs] = useState([]);

    useEffect(() => {
        setPersonFormData(persons);
    }, [persons]);

    useEffect(() => {
        startPersonFormValidation();
        generatePersonCardRefs();
    }, [personFormData]);

    const generatePersonCardRefs = () => {
        setPersonCardRefs(personRef => (
            Array(personFormData.length).fill(1).map((_, i) => personRef[i] || createRef())
        ))
    }

    const onAddPersonClickHandler = () => {
        setPersonFormData([...personFormData, personInitialForm]);
    }
    /*
        remove fields
        params: index: <number>
     */
    const onRemovePersonFormField = (index: number) => setPersonFormData(personFormData.filter((item, itemIndex) => itemIndex !== index))

    const onPersonChangeHandler = (index: number, fieldName: string, value: string) => {
        //check for non english and "-", "," and "space"
        if(value && !isValidEnglish(value)) return false

        const personFormValues = [...personFormData];
        personFormValues[index] = {...personFormValues[index], [fieldName]: value};
        setPersonFormData([...personFormValues]);
    }

    const onNextClickHandler = () => {
        dispatch(setPersons(personFormData));
        props.history.push("/order/vaccine")
    }

    const onClearClickHandler = () => {
        dispatch(initPersons());
        personCardRefs.forEach((ref: any) => ref.current?.clearCountryInput())
    }

    const handlePersonFormCutomValidations = (fieldName: string, person: PersonFormData): boolean => {
        switch(fieldName) {
            case "passportExpiry":
                return passportExpiryValidation(person[fieldName]);
            case "birthDate":
                return birthDateValidation(person[fieldName]);
            case "nationalId":
                return nationalIdValidation(person[fieldName]);
            default:
                return false;
        }
    }

    const startPersonFormValidation = (): void => {
        let index = 0;
        const errors = new Map<number, ValidationError[]>();
        for (const person of personFormData) {
            let validationErrorList: ValidationError[] = [];
            for (const key in person) {
                let isValid: boolean = emptyValidation(key, person);
                let validationType = ValidationTypes.EMPTY;
                if (isValid && personFormCustomValidationFields.includes(key)) {
                    isValid = handlePersonFormCutomValidations(key, person);
                    validationType = ValidationTypes.CUSTOME
                }
                if (person.nationality !== getCountryName("IR") && key === "nationalId") {
                    isValid = true;
                }
                validationErrorList.push({
                    fieldName: key,
                    isValid: isValid,
                    validationType: validationType
                })
            }
            errors.set(index, validationErrorList);
            index++;
        }
        setPersonErrors(errors);
    }

    const isPersonFormValid = (): boolean => {
        let isEntireFormValid: boolean = true;
        if (personErrors) {
            for (const [key, value] of personErrors.entries()) {
                value.forEach((item: ValidationError) => {
                    if (item.isValid === false) {
                        isEntireFormValid = false;
                    }
                })
            }
        } else {
            isEntireFormValid = false;
        }
        return isEntireFormValid;
    }

    const validAndSubmit = () => {
        if(isPersonFormValid()) {
            onNextClickHandler()
        }else{
            if (!showErrors) {
                setShowErrors(true);
            }
        }
    }

    return <Page>
        <OrderLayout
            hideClearButton
            enableSteps={["1"]}
            onClearClick={onClearClickHandler}
            onNextClick={validAndSubmit}
        >
            <Container fluid>
                <Row>
                    <Col
                        className={`${baseStyles.center_text} mt-3 mb-3`}
                        md={{span: 8, offset: 2}}>
                        {t("stepOneDesc")}
                    </Col>
                </Row>
                <Row>
                    {
                        personFormData.map((person, index) => (
                            <PersonCard
                                ref={personCardRefs[index]}
                                showErrors={showErrors}
                                validationErrors={personErrors?.get(index)}
                                person={person}
                                key={index}
                                onPersonChange={(fieldName, value) => onPersonChangeHandler(
                                    index, fieldName, value
                                )}
                                onRemove={() => {
                                    onRemovePersonFormField(index)
                                }}
                                number={index + 1}
                            />
                        ))
                    }
                    <AddPersonButton onClick={onAddPersonClickHandler}/>
                </Row>
            </Container>
        </OrderLayout>
    </Page>
}

export default PersonForm;
