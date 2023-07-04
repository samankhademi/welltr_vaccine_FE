import {ReactElement} from "react";
import s from "./Summery.module.css";
import {ReactComponent as Calendar} from "./assets/calendar.svg";
import {ReactComponent as Room} from "./assets/room.svg";
import {ReactComponent as Adult} from "./assets/adult.svg";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {useTranslation} from "react-i18next";

type PropsTypes = {
    offAmount?: any
}


const SummeryHolder = (props: PropsTypes):ReactElement => {
    const order = useSelector((state: RootState) => state.profile.order);
    const {t,i18n} = useTranslation();
    const renderTotalPrice = ():any => {
        try {
            return (order.data.hotel_package?.price).toFixed(2)

        }catch (e){
            console.log('e',e)
            return 0
        }
    }
    const renderFinalPrice = ():any => {
        try {
            //percent
            //const finalPrice = props.offAmount ? order.data?.amount - ((props.offAmount / 100) * order.data?.amount) : order.data?.amount

            const finalPrice = props.offAmount ?
                                    order.data?.is_used_coupon ? order.data?.amount : order.data?.amount - props.offAmount
                                        :
                                    order.data?.amount
            return (finalPrice).toFixed(2)

        }catch (e){
            return 0
        }
    }
    const fallBackLang = function (lang:string){
        return lang === 'es' ? 'en' : lang
    }

    const renderFieldLang = (field:string):string => {
        try{
            return order.data.hotel_package[field + "_" + fallBackLang(i18n.language)]
        }catch (e){
            return ""
        }
    }
    console.log(order.data?.is_used_coupon, props.offAmount)
    return <>
        <div className={s.summerySidebar}>
            <div className={s.summerySidebarHolder}>
                <div className={s.hotelName}>{order.data.hotel_package?.hotel_name}</div>
                <div className={s.hotelAddress}>{renderFieldLang('address')}</div>
                <div className={s.separator}/>
                <div className={s.stayFields}>
                    <Calendar className={s.fieldIcon}/>
                    <span className={s.fieldValue}>{String(order.data.hotel_package?.nights_num) === "0" ? t('withoutHotel') : `${order.data.hotel_package?.nights_num} ${t('night(s)')}`}</span>
                </div>
                <div className={s.stayFields}>
                    <Room className={s.fieldIcon}/>
                    <span className={s.fieldValue}>{renderFieldLang('room_type')}</span>
                </div>
                <div className={`${s.stayFields} m-0`}>
                    <Adult className={s.fieldIcon}/>
                    <span className={s.fieldValue}>{order.data.hotel_package?.total_person} {t('person')}</span>
                </div>
                <div className={s.separator}/>

                <div className={s.priceHolder}>
                    {order.data.hotel_package?.nights_num > 0 &&
                        <div className={s.priceFieldRow}>
                            <div className={s.priceField}>{t('pricePerNight')}</div>
                            <div
                                className={s.priceValue}>{(order.data.hotel_package?.price / order.data.hotel_package?.nights_num).toFixed(2)}</div>
                        </div>
                    }
                    {(order.data?.is_used_coupon || props.offAmount) &&
                        <div className={s.priceFieldRow}>
                            <div className={`${s.priceField} ${s.totalOldPriceField}`}>{t('totalPrice')}</div>
                            <div className={`${s.priceValue} ${s.totalOldPriceValue}`}>{renderTotalPrice()}</div>
                        </div>
                    }
                    <div className={s.priceFieldRow}>
                        <div className={`${s.priceField} ${s.totalPriceField}`}>{t('finalPrice')}</div>
                        <div className={`${s.priceValue} ${s.totalPriceValue}`}>{(order.data?.is_used_coupon || props.offAmount) ? renderFinalPrice() : order.data?.amount}</div>
                    </div>

                </div>
            </div>
        </div>
    </>
}

export default SummeryHolder