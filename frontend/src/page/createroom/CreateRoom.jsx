import React, { useState, useContext } from 'react';
import './CreateRoom.css'
import PrimaryButton from '../../components/buttons/PrimaryButton';
import RadioButtons from './Radiobtn';
import Axios from 'axios';
import { SnackBarcontext } from '../../components/contexts/Snackbarcontext';
import { useHistory } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import { Logincontext } from "../../components/contexts/Logincontext";
import { ROOM_MEMBERS, ROOM_FEES } from '../../const';

const CreateRoom = () => {
    const loginContext = useContext(Logincontext);
    const { t } = useTranslation();
    const history = useHistory();
    const API_Url = process.env.REACT_APP_API_URL;

    const snackBarContext = useContext(SnackBarcontext);

    const { username, bounty } = loginContext.user || {};

    const [bonus, setBonus] = useState(ROOM_FEES[0]);
    const [fee, setFee] = useState(ROOM_FEES[0] * 6);
    const [size, setSize] = useState(ROOM_MEMBERS[0]);

    const handleCreateRoom = async () => {
        if (bounty < fee) {
            snackBarContext.controlSnackBar(t('SNACKBAR_MONEY_WARNING_CONTENT'), "warning");
            return;
        }

        const temp = await Axios.post(`${API_Url}/create_room`, { creator: username, bonus: bonus, fee: fee, status: 0, size: size });

        if (temp?.data?.roomID < 0) {
            snackBarContext.controlSnackBar(t('SNACKBAR_ROOM_WARNING_CONTENT'), "warning")
            history.push("/main");
        }
        else {
            const room_ID_Url = "/luckyman-" + temp?.data?.roomID;
            localStorage.setItem(
                'roomInfo',
                JSON.stringify({
                    room_id: temp?.data?.roomID,
                    room_bonus: bonus,
                    room_fee: fee,
                    room_size: size,
                }),
            );
            snackBarContext.controlSnackBar(t('SNACKBAR_ROOM_SUCCESS_CONTENT'), "success")
            history.push(`${room_ID_Url}`);
        }
    }

    const setBonusFee = (value) => {
        setBonus(value);
        setFee(value * 6);
    }

    const returnRoom = () => {
        history.push('/room')
    }

    return (
        <div className='roomcontainer row'>
            <div className="titlebar row">
                <div className='title' style={{userSelect:'none'}}>
                    <label>Lucky Man</label>
                </div>
            </div>
            <div className='abc column'>
                <div className='sizebundle' style={{userSelect:'none'}}>
                    <RadioButtons text={ROOM_MEMBERS} setValue={setSize} />
                </div>
                <div className='feebundle' style={{userSelect:'none'}}>
                    <RadioButtons text={ROOM_FEES} setValue={setBonusFee} />
                </div>
                <div className='createroom'>
                    <PrimaryButton content={`${t('CREATE_ROOM_BUTTON')}`} onClick={handleCreateRoom} type='Create_room' />
                    <div style={{ width: '45px' }}></div>
                    <PrimaryButton content={"Cancel"} onClick={returnRoom} type='Cancel' />
                </div>
            </div>
        </div>
    )
}

export default CreateRoom;