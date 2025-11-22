import React, { useEffect, useRef, useState } from 'react';
import './Room.css'
import PrimaryButton from '../../components/buttons/PrimaryButton';
import Axios from 'axios';
import RoomItem from '../../components/roomitem/RoomItem';
import Pagination from '../../components/pagination/Pagination';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuIconButton from '../../components/buttons/MenuIconButton';
import io from 'socket.io-client';
import { ROOM_COUNTS_PER_PAGE } from '../../const';
import SearchInput from '../../components/inputs/SearchInput';

const Room = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const socket = useRef(null);

    const API_Url = process.env.REACT_APP_API_URL;
    const Socket_Url = process.env.REACT_APP_SOCKET_URL;

    const [roomData, setRoomData] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(10);
    const pageCount = ROOM_COUNTS_PER_PAGE;

    async function fetchData() {
        const temp = await Axios.post(`${API_Url}/get_rooms`, { search_key: search, pgSize: pageCount, pgNum: page });
        setRoomData(temp?.data?.data);
        setTotal(temp?.data?.total[0]?.total_cnt % pageCount === 0 ? temp?.data?.total[0]?.total_cnt / pageCount : Math.ceil(temp?.data?.total[0]?.total_cnt / pageCount));
    }

    useEffect(() => {
        fetchData();
        socket.current = io.connect(`${Socket_Url}`);
        socket.current.on('room_refetch', (elem) => {
            fetchData();
        });
    }, [])

    useEffect(() => {
        fetchData();
    }, [page]);

    const onNext = () => {
        setPage(page => page < total ? page + 1 : 1);
    }

    const onPrev = () => {
        setPage(page => page > 1 ? page - 1 : total);
    }

    const handleSearch = () => {
        fetchData();
        setPage(1);
    }

    const handleCreate = () => {
        history.push("/create");
    }

    return (
        <div className='roomcontainer row'>
            <div className='titlebar row'>
                <div className='title' style={{userSelect:'none'}}>
                    Lucky Man
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', flex: '7' }}>
                <div className='createbtn'>
                    <PrimaryButton
                        content={`${t('ROOM_CREATE')}`}
                        onClick={handleCreate}
                        type='Create'
                    />
                </div>
                <div className='search_area row'>
                    <div style={{ zIndex: 0 }}>
                        <SearchInput searchValue={search} setSearchValue={setSearch} />
                    </div>
                    <div style={{ zIndex: 1, position: 'absolute', right: "-6px" }}>
                        <PrimaryButton content={`${t('ROOM_SEARCH')}`} onClick={handleSearch} type='Search' />
                    </div>
                </div>
                <div className='roomlist column'>
                    <div className='listheader row'>
                        <label className="headerLabel" style={{ flex: 0.5 ,userSelect:'none'}}>{`${t('ROOM_ID')}`}</label>
                        <label className="headerLabel" style={{ flex: 1 ,userSelect:'none'}}>{`${t('ROOM_CREATOR')}`}</label>
                        <label className="headerLabel" style={{ flex: 0.5 ,userSelect:'none'}}>{`${t('ROOM_BONUS')}`}</label>
                        <label className="headerLabel" style={{ flex: 0.5 ,userSelect:'none'}}>{`${t('ROOM_FEE')}`}</label>
                        <label className="headerLabel" style={{ flex: 1.5 ,userSelect:'none'}}>{`${t('ROOM_SIZE')}`}</label>
                        <label className="headerLabel" style={{ flex: 1 ,userSelect:'none'}}>{`${t('ROOM_ENTRY_STATUS0')}`}</label>
                    </div>
                    <div className='listbody column'>
                        {
                            roomData && roomData.map(item => <RoomItem key={item.room_id} item={item} />)
                        }
                    </div>
                    {
                        total > 1 &&
                        <div style={{ position: 'absolute', bottom: "0%" }}>
                            <Pagination
                                page={page}
                                total={total}
                                onNext={onNext}
                                onPrev={onPrev}
                            />
                        </div>
                    }
                </div>
            </div>
            <div className='userfield column'>
                <MenuIconButton />
            </div>
        </div >
    )
}

export default Room;