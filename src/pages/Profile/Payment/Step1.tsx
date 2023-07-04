import React, {ReactElement,useState, useRef} from "react";
import ContentCardGuest from "components/ContentCard/ContentCard";
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import styles from "./Step1.module.css";
import {useTranslation,} from "react-i18next";
import Popup from "components/Popup/Popup";
import VaccineInformation, {VaccineInformationHandleMethods} from "components/VaccineInformation/VaccineInformation";
import PersonInformation, {PersonInformationHandleMethods} from "components/PersonInformation/PersonInformation";
import {PersonFormData, VaccineFormData} from "pages/Order/orderSlice";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrder} from "../profileSlice";
import * as API from "api";
import DeleteInformation from "components/DeleteInformation/DeleteInformation";
import {getCountryCode} from "components/PersonCard/countries";
import Toaster, {ToasterHandleMethods} from "components/Toaster/Toaster";
import {RootState} from "../../../store/store";

enum PaymentPopupTypes {
    None = "0",
    VaccineInformation = "1",
    PersonInformation = "2",
    DeletePerson = "3"
}
type PropsTypes = {
    onNext?: () => void,
}

const Step1 = (props: PropsTypes): ReactElement => {

    const dispatch = useDispatch();

    const [showError, setShowError] = useState({
        show: false,
        message: ""
    });
    const order = useSelector((state: RootState) => state.profile.order);

    const [selectedEditPerson, setSelectedEditPerson] = useState<PersonFormData>({
        birthCountry: "",
        birthDate: "",
        gender: "",
        name: "",
        nationalId: "",
        nationality: "",
        passportExpiry: "",
        passportNumber: "",
        surname: ""
    });

    const [enabledPopup, setEnabledPopup] = useState<PaymentPopupTypes>(
        PaymentPopupTypes.None);

    const vaccineInfoRef = useRef<VaccineInformationHandleMethods>(null);

    const personInfoRef = useRef<PersonInformationHandleMethods>(null);

    const [popupLoading, setPopupLoading] = useState<boolean>(false);

    const {t} = useTranslation();

    const toasterRef = useRef<ToasterHandleMethods>(null);

    const onPopUpSubmitClickHandler = () => {
        if (enabledPopup === PaymentPopupTypes.VaccineInformation) {
            if (vaccineInfoRef.current) {
                const vaccineForm: VaccineFormData = vaccineInfoRef.current.getVaccineForm();
                setPopupLoading(true);
                API.editOrder(vaccineForm.center, vaccineForm.type).finally(() => {
                    setPopupLoading(false);
                    setEnabledPopup(PaymentPopupTypes.None);
                    dispatch(fetchOrder());
                });
            }
        } else if (enabledPopup === PaymentPopupTypes.PersonInformation) {
            if (personInfoRef.current) {
                if(!personInfoRef.current.isValid()){
                    toasterRef.current?.onShowToaster(t('personalDataIsNotValid'),'error');
                    return false
                }
                let personForm: PersonFormData = {...personInfoRef.current.getPersonForm()};
                personForm.nationality = getCountryCode(personForm.nationality);
                personForm.birthCountry = getCountryCode(personForm.birthCountry);
                setPopupLoading(true);
                API.editPerson(personForm).finally(() => {
                    setPopupLoading(false);
                    setEnabledPopup(PaymentPopupTypes.None);
                    dispatch(fetchOrder());
                })
                toasterRef.current?.onShowToaster(t('personalEditSuccess'),'success');
            }
        } else {
            setPopupLoading(true);
            API.deletePerson(selectedEditPerson.uuid).finally(() => {
                setPopupLoading(false);
                setEnabledPopup(PaymentPopupTypes.None);
                dispatch(fetchOrder());
            })
        }
    }

    //check for person passports uploaded
    const isCompleteFormValid = (): boolean => {
        for (const person of order.data.persons) {
            if (!person.passport_image || person.passport_image === "") {
                return false;
            }
        }
        return true;
    }

    const handleClose = () => {
        setShowError({
            show: false,
            message: ""
        });
    }

    return (
        <>
            <Toaster ref={toasterRef}/>

            {
                (enabledPopup !== PaymentPopupTypes.None) &&
                <Popup
                    submitText={
                        (enabledPopup === PaymentPopupTypes.DeletePerson) ?
                            t("yes")
                            :
                            t("save")
                    }
                    width={
                        (enabledPopup === PaymentPopupTypes.DeletePerson) ?
                            "400px" : "70%"}
                    loading={popupLoading}
                    onSubmitClick={onPopUpSubmitClickHandler}
                    onCancelClick={() => setEnabledPopup(PaymentPopupTypes.None)}>
                    {
                        enabledPopup === PaymentPopupTypes.VaccineInformation &&
                        <VaccineInformation
                            vaccineInitialData={order.data.vaccine}
                            ref={vaccineInfoRef}/>
                    }
                    {
                        enabledPopup === PaymentPopupTypes.PersonInformation &&
                        <PersonInformation
                            personInitialData={selectedEditPerson}
                            ref={personInfoRef}
                        />
                    }
                    {
                        enabledPopup === PaymentPopupTypes.DeletePerson &&
                        <DeleteInformation/>
                    }
                </Popup>
            }
                    <>
                        {
                            order.data.persons.map((person, index) => (
                                <ContentCardGuest
                                    key={index}
                                    passportUrl={person.passport_image}
                                    uid={person.uuid}
                                    onEditClick={() => {
                                        setEnabledPopup(PaymentPopupTypes.PersonInformation);
                                        setSelectedEditPerson(person);
                                    }}
                                    onDeleteClick={() => {
                                        setEnabledPopup(PaymentPopupTypes.DeletePerson);
                                        setSelectedEditPerson(person);
                                    }}
                                    isButtonEnable
                                    buttonText={t("uploadPassport")}
                                    actions={
                                        //.(order.data.persons.length === 1) ?
                                        ["edit"]
                                        //:
                                        //["edit", "delete"]
                                    }
                                    contents={[
                                        {
                                            title: t("name"),
                                            value: person.name,
                                        },
                                        {
                                            title: t("surname"),
                                            value: person.surname
                                        },
                                        {
                                            title: t("passportNo"),
                                            value: person.passportNumber
                                        }
                                    ]}
                                    title={t("person") + " " + (index + 1)}
                                    margin="20px"/>
                            ))
                        }
                    </>
                    <div className={styles.actionHolder}>
                        <div>
                            {!isCompleteFormValid() && <OverlayTrigger overlay={<Tooltip
                                id="tooltip-disabled">{t('profilePaymentStep1DisabledButtonTooltip')}</Tooltip>}>
                                                  <span className="mx-3">
                                                      {t('whyThisButtonNotEnable')}
                                                  </span>
                            </OverlayTrigger>}

                            <Button
                                className={styles.next_step}
                                onClick={props.onNext}
                                disabled={!isCompleteFormValid()}
                                variant="primary">
                                {t('nextStep')}
                            </Button>
                        </div>
                    </div>
        </>
    )
}

export default Step1;
