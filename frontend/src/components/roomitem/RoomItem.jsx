import React, { useContext } from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Logincontext } from '../contexts/Logincontext';

function RoomItem(props) {
    const loginContext = useContext(Logincontext);
    const { t } = useTranslation();

    const { item } = props;
    // Status: 0 => Entry, Status: 1 => Full, Status: 2 => Progress
    const status = item.status;

    const history = useHistory();

    const user_bounty = loginContext.user?.bounty;
    const disabled = user_bounty < item.fee ? true : false;

    const handleEntryRoom = () => {
        const room_ID_Url = "/luckyman-" + item.room_id;
        localStorage.setItem(
            'roomInfo',
            JSON.stringify({
                room_id: item.room_id,
                room_bonus: item.bonus,
                room_fee: item.fee,
                room_size: item.size,
            }),
        );
        history.replace(`${room_ID_Url}`,);
    }
    return (
        <div className='listbodyitem row' key={item.room_id}>
            <label className='bodylabel' style={{ flex: 0.5,userSelect:'none' }}>{item.room_id}</label>
            <label className="bodylabel" style={{ flex: 1 ,userSelect:'none'}}>{item.creator}</label>
            <label className="bodylabel" style={{ flex: 0.5 ,userSelect:'none'}}>{item.bonus}</label>
            <label className="bodylabel" style={{ flex: 0.5 ,userSelect:'none'}}>{item.fee}</label>
            <label className="bodylabel" style={{ flex: 1.5 ,userSelect:'none'}}>{item.size}&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;{item.members}</label>
            {
                status === 0 && <label className="buttonlabel row" style={{ flex: 1}}>
                    <PrimaryButton disabled={disabled} content={`${t('ROOM_ENTRY_STATUS0')}`} onClick={handleEntryRoom} type='Entry' />
                </label>
            }
            {
                status === 1 && <label className="bodylabel" style={{ flex: 1,userSelect:'none' }}>{`${t('ROOM_ENTRY_STATUS1')}`}</label>
            }
            {
                status === 2 && <label className="bodylabel" style={{ flex: 1,userSelect:'none' }}>{`${t('ROOM_ENTRY_STATUS2')}`}</label>
            }
            {
                status === 3 && <label className="bodylabel" style={{ flex: 1,userSelect:'none' }}>{`${t('ROOM_ENTRY_STATUS3')}`}</label>
            }
        </div>
    )
}

export default RoomItem;