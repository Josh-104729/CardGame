import React from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import { useTranslation } from 'react-i18next';

function Pagination(props) {

    const { t } = useTranslation();

    const { page, total, onPrev, onNext } = props;
    return (
        <div className='row'>
            <PrimaryButton disabled={page === 1 ? true : false} content={`${t('PREV_BUTTON')}`} onClick={onPrev} type='Primary'/>
            <label style={{fontSize:"24px",fontFamily:"PKS Bukgul Bold",color:"White"}}>{page}/{total}</label>
            <PrimaryButton disabled={page === total ? true : false} content={`${t('NEXT_BUTTON')}`} onClick={onNext} type='Primary'/>
        </div>
    )
}

export default Pagination