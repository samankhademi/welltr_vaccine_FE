import React, { Fragment, ReactElement } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ContentCard.module.css";
import {ReactComponent as EditIcon} from "./assets/edit.svg";
import {ReactComponent as DeleteIcon} from "./assets/delete.svg";
import {ReactComponent as UploadIcon} from "./assets/upload.svg";
import { useTranslation } from "react-i18next";
import { getDirectionByLang } from "utils/base";
import axios, { AxiosResponse } from "axios";
import { useRef } from "react";
import { ChangeEvent } from "react";
import { useState } from "react";
import Ellipsis from "components/Ellipsis/Ellipsis";
import { useDispatch } from "react-redux";
import { fetchOrder } from "pages/Profile/profileSlice";
import Toaster, { ToasterHandleMethods } from "components/Toaster/Toaster";

type ContentCardActions = "edit" | "delete";

type ContentCardProps = {
    uid?: string,
    title: string,
    margin?: string,
    contents: Array<{ title: string, value: string, size?: number }>,
    actions: ContentCardActions[],
    isButtonEnable?: boolean,
    buttonText?: string,
    onEditClick?: () => void,
    onDeleteClick?: () => void,
    passportUrl?: string
}

const ContentCard = (props: ContentCardProps): ReactElement => {

    const {t, i18n} = useTranslation();

    const fileRef = useRef<any>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    const getActionName = (action: ContentCardActions): string => {
        switch (action) {
            case "edit":
                return t("edit");
            default:
                return t("delete")
        }
    }

    const getActionIcon = (action: ContentCardActions): ReactElement => {
        switch (action) {
            case "edit":
                return <EditIcon className={styles.content_body_button_icon}/>;
            case "delete":
                return <DeleteIcon className={styles.content_body_button_icon}/>;
        }
    }

    const getActionEvent = (action: ContentCardActions) => {
        switch (action) {
            case "edit":
                return props.onEditClick;
            case "delete":
                return props.onDeleteClick;
        }
    }

    const onImageSelectHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            setLoading(true);
            const file = event.target.files[0];
            fileUpload(file).then(() => {
                toasterRef.current?.onShowToaster(t('passportUploadSuccess'),'success');
                setTimeout(() => {
                    dispatch(fetchOrder());
                },1500)
            }).catch((error) => {
                setTimeout(() => {
                    toasterRef.current?.onShowToaster(t('passportUploadFailed'),'error');
                },0)
            }).finally(() => {
                setLoading(false);
            });
        }
    }
    
    const fileUpload = (file: File): Promise<AxiosResponse<any>> => {
        const url = '/api/v1/auth/upload/' + props.uid + "/";

        const formData = new FormData();

        formData.append('passport_image', file);

        return axios.post(url, formData, {})
    }
    const toasterRef = useRef<ToasterHandleMethods>(null);

    return <div style={{margin: `${props.margin} 0`}} className={styles.content_container}>
        <Toaster ref={toasterRef}/>

        <div className={styles.content_title}>
            {props.title}
        </div>
        <div className={styles.content_body}>
            <div
                style={{direction:getDirectionByLang(i18n.language)}}
                className={styles.content_body_actions}>
                {
                    props.actions.map((action, index) => (
                        <Fragment key={index}>
                            <div
                                onClick={getActionEvent(action)}
                                className={styles.content_body_button}>
                                {getActionIcon(action)}
                                {getActionName(action)}
                            </div>
                            <div className={styles.content_body_button_space}></div>
                        </Fragment>
                    ))
                }
            </div>
            <Container className={styles.content_body_container} fluid>
                <Row>
                    {
                        props.contents.map((content, index) => (
                            <Col md={content.size ? content.size : 3} key={index}>
                                <div className={styles.content_item_title}>
                                    {content.title}
                                </div>
                                <div className={styles.content_item_body}>
                                    {content.value}
                                </div>
                            </Col>
                        ))
                    }
                    {
                        (props.isButtonEnable) && 
                        <>
                            <Col md={{span: 3}}>
                                {
                                    (props.passportUrl && props.passportUrl !== "") ?
                                    <>

                                        <a className={styles.download_link} href={props.passportUrl}>
                                            {t("download")}
                                        </a>
                                    </>
                                    :
                                    <div onClick={() => fileRef.current?.click()} className={styles.button}>
                                        {
                                            loading ? <Ellipsis/> :
                                            <>
                                                <UploadIcon className={styles.button__icon}/>
                                                {props.buttonText}
                                            </>
                                        }
                                    </div>
                                }
                            </Col>

                            <input
                                onChange={onImageSelectHandler}
                                capture="camera"
                                accept="pdf/*"
                                ref={fileRef}
                                style={{display: "none"}}
                                type={"file"}
                                name={"fileCamera"}/>
                        </>
                    }
                </Row>
            </Container>
        </div>
    </div>
}

export default ContentCard;
