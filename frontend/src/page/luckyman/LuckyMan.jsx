import React, { useContext, useEffect, useState, useRef } from 'react'
import UserComponent from '../../components/user/UserComponent';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { handleEmptyCard } from '../../components/redux/actions/card';
import { useDispatch, useSelector } from 'react-redux';
import { CardCompareUtil } from '../../utils/cardCompareUtil';
import { GuessValidationCheck } from '../../utils/guessValidationCheck';
import { SnackBarcontext } from '../../components/contexts/Snackbarcontext';
import { Logincontext } from '../../components/contexts/Logincontext';
import { useHistory } from 'react-router-dom';
import CardComponent from '../../components/cards/CardComponent';
import io from 'socket.io-client';
import ResultModal from '../../components/modals/resultmodal/ResultModal';
import { PosCalculator } from '../../utils/posCalculator';
import TaSoEffect from '../../components/effects/TaSoEffect';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const LuckyMan = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const snackBarContext = useContext(SnackBarcontext);
    const loginContext = useContext(Logincontext);

    const user = loginContext.user || {};
    const { username, avatarUrl, bounty } = user;
    const { room_id, room_bonus, room_fee, room_size } = JSON.parse(localStorage.getItem('roomInfo'));
    const roomId = room_id;

    const [order, setOrder] = useState(0);
    const [lastOrder, setLastOrder] = useState(0);
    const [isStart, setStart] = useState(false);
    const [isShutVisible, setIsShutVisible] = useState(false);
    const [restCardCnt, setRestCardCnt] = useState(0);
    const [isResultModalOpen, setResultModalOpen] = useState(false);

    const [userArray, setUserArray] = useState([]);
    const [havingCards, setHavingCards] = useState([])
    const [droppingCards, setDroppingCards] = useState([])
    const [hostFrom, setHostFrom] = useState(0);
    const [isPass, setIsPass] = useState(false);
    const [winner, setWinner] = useState('');
    const [counterCnt, setCounterCnt] = useState(0);
    const [exitflg, setExitFlg] = useState(false);
    const [previousBounty, setPreviouseBounty] = useState(0);
    const [double, setDouble] = useState(1);
    const [userPos, setUserPos] = useState([]);
    const [dropPos, setDropPos] = useState([]);
    const [effectkind, setEffectKind] = useState('');
    const [effectOpen, setEffectOpen] = useState(false);

    const card = useSelector(state => state.card)
    const socket = useRef(null);
    const history = useHistory();


    const checkRules = () => {
        if (lastOrder === order) {
            setIsShutVisible(card.choosedCard.length > 0);
        } else {
            const previousCard = droppingCards[lastOrder];
            //!!!!! Should check if the previous Card is right        
            setIsShutVisible(CardCompareUtil(previousCard, card.choosedCard));
        }
    }
    
    useEffect(() => {
        checkRules();
    }, [card.choosedCard, counterCnt])

    const Socket_Url = process.env.REACT_APP_SOCKET_URL;
    useEffect(() => {
        if (!username) return;
        socket.current = io.connect(`${Socket_Url}`);
        socket.current.emit("join", {
            user: {
                username,
                avatarUrl,
                bounty
            },
            room: {
                roomId,
                bonus: room_bonus,
                fee: room_fee,
                size: room_size
            }
        })

        socket.current.on('update', (param) => {
            const { roomData, passBanner } = param;
            setOrder(roomData.order);
            setLastOrder(roomData.prevOrder);
            setStart(roomData.isStart);
            setRestCardCnt(roomData.restCardCnt);
            setUserArray(roomData.userArray);
            setHavingCards(roomData.havingCards);
            setDroppingCards(roomData.droppingCards);
            setDouble(roomData.double);
            setEffectKind(roomData.effectKind);
            setEffectOpen(roomData.effectOpen);

            const pos = PosCalculator(roomData.userArray.length, roomData.droppingCards, [window.innerWidth, window.innerHeight])
            setUserPos(pos.userPos);
            setDropPos(pos.dropPos);

            if (roomData.order === roomData.prevOrder) {
                setEffectKind('');
                setEffectOpen(false);
            }
            const index = roomData.userArray.findIndex(item => item.username === username);
            if (index > -1) {
                setHostFrom(index);
            } else {
                setHostFrom(0);
            }
            setCounterCnt(roomData.counterCnt);
            if (roomData.counterCnt === 0) {
                dispatch(handleEmptyCard());
            }

            if (roomData.isFinish && roomData.isStart) {
                setResultModalOpen(roomData.isFinish);
                setWinner(roomData.userArray[roomData.prevOrder].username);
            } else {
                setResultModalOpen(false);
            }

            CheckIfShouldExit(roomData.userArray);

            if (passBanner) {
                setIsPass(true);
                setTimeout(() => setIsPass(false), 1000);
            }

            setExitFlg(roomData.userArray[index]?.exitreq);
            if (!roomData.isFinish) {
                setPreviouseBounty(roomData.userArray[index]?.bounty);
            }
            if (roomData.userArray[index] && roomData.userArray[index].bounty !== bounty) {
                loginContext.setUser({
                    ...loginContext.user,
                    bounty: roomData.userArray[index].bounty
                })
            }
        }, [username])

        socket.current.on('exit', (param) => {
            if (roomId !== param.roomId) return;
            history.push('/main');
            if (param.host) {
                snackBarContext.controlSnackBar(t('SNACKBAR_ROOM_CLOSED_CONTENT'), "error");
            }
        })

        socket.current.on("full", (param) => {
            if (roomId !== param.roomId) return;
            snackBarContext.controlSnackBar(param.msg, param.variant)
        })

    }, [])

    const CheckIfShouldExit = (users) => {
        const findIndex = users.findIndex(user => user.username === username);
        if (findIndex === -1) {
            history.push('/main');
        }
    }

    const whoseOrder = () => {
        socket.current.emit("passcards", { roomId })
    }

    const shutCards = () => {
        let obj = GuessValidationCheck(card.choosedCard);
        let tep_double = double;
        let tep_effectOpen;
        let tep_effectkind;
        switch (obj.status) {
            case 0:
                snackBarContext.controlSnackBar(obj.msg, 'error');
                return;
            case 3:
                tep_double *= 2;
                tep_effectOpen = true;
                tep_effectkind = "madae";
                break;
            case 4:
                tep_double *= 2;
                tep_effectOpen = true;
                tep_effectkind = "tawang";
                break;
            default:
                break;
        }

        setDouble(tep_double);
        setEffectOpen(tep_effectOpen);
        setEffectKind(tep_effectkind);
        socket.current.emit("shutcards", { choosedCard: card.choosedCard, roomId, double: tep_double, effectOpen: tep_effectOpen, effectkind: tep_effectkind });
        //!!!!! Change util function to checkRules with Da and So
    }

    const startFunc = async () => {
        socket.current.emit("startgame", { roomId });
    }

    const exitFunc = async () => {
        if (isStart) {
            setExitFlg(exitflg => !exitflg);
        }
        socket.current.emit("exit", { roomId });
    }

    const useStyles = makeStyles(theme => ({
        startBtn: {
            margin: theme.spacing(2),
            position: 'fixed',
            top: '35%',
            left: '33%',
            zIndex: 10,
            visibility: isStart || hostFrom ? 'hidden' : 'visible',
        },
        restcard: {
            zIndex: 1,
            display: "flex",
            flexDirection: " row",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: window.innerHeight / 37 * 12,
            left: window.innerWidth / 54 * 28,
            visibility: restCardCnt > 0 ? "visible" : "hidden",
            userSelect:'none',
        },
        restcnt: {
            zIndex: 2,
            fontSize: 50,
            position: "absolute",
            top: 20,
            textAlign: "center",
            color: "white",
            textShadow: "3px 3px 3px black",
            userSelect:'none',
        },
        buttonContainer: {
            position: "absolute",
            top: window.innerHeight / 37 * 22,
            left: window.innerWidth / 54 * 22,
            display: "flex",
            flexDirection: "row",
            zIndex: 10,
            visibility: !isStart || userArray[order]?.username !== username ? 'hidden' : 'visible',
        },
        exitBtn: {
            position: 'fixed',
            top: window.innerHeight / 37,
            left: window.innerWidth / 54 * 48,
            zIndex: 10,
        },
        titleArea: {
            position: "absolute",
            top: window.innerHeight / 37,
            left: window.innerWidth / 54 * 22,
            userSelect:'none',
        }
    }));

    const reorderUserArray = (arr) => {
        return [...arr.slice(hostFrom), ...arr.slice(0, hostFrom)];
    }

    const classes = useStyles();
    const orderedUsers = reorderUserArray(userArray);

    return (
        <div className='roomcontainer row'>
            {orderedUsers.map((item, index) => {
                return (
                    <UserComponent
                        key={index}
                        userPos={userPos[index]}
                        dropPos={dropPos[index]}
                        src={item?.src}
                        username={item?.username}
                        bounty={item?.bounty}
                        havingCardsArray={havingCards[(index + hostFrom) % room_size]}
                        droppingCardsArray={droppingCards[(index + hostFrom) % room_size]}
                        cardVisible={index === 0 && !isResultModalOpen}
                        order={orderedUsers[index]?.username === userArray[order]?.username}
                        lastOrder={orderedUsers[index]?.username === userArray[lastOrder]?.username}
                        host={orderedUsers[index]?.username === userArray[0]?.username}
                        exitReq={orderedUsers[index]?.exitreq}
                        isPass={isPass && isStart && orderedUsers[index]?.username === userArray[order - 1 < 0 ? room_size - 1 : order - 1]?.username}
                        isStart={isStart}
                        counterCnt={counterCnt}
                    />
                )
            })}
            <div className={classes.startBtn}>
                <PrimaryButton
                    content={''}
                    onClick={startFunc}
                    type='Start'
                    disabled={userArray.length !== room_size}
                />
            </div>
            <div className='titlebar row' style={{userSelect:'none'}}>
                <label className='title'>BONUS {room_bonus * double}</label>
            </div>
            {isStart && <div className={classes.restcard}>
                <h1 className={classes.restcnt}>{restCardCnt}</h1>
                <CardComponent
                    selfCard={true}
                    isCoveredCard={true}
                    order={false}
                    cardCnt={restCardCnt}
                />
                {/* {restingCards.map((item, index) => {
                    if (index < restCardCnt) {
                        return (
                            <CardComponent
                                key={index}
                                selfCard={true}
                                index={index}
                                isCoveredCard={true}
                                order={false}
                                cardCnt={restCardCnt}
                            />
                        )
                    }
                })} */}
            </div>
            }
            <div className={classes.buttonContainer}>
                <PrimaryButton
                    content={`${t('LUCKYMAN_MODAL_PASS_BUTTON')}`}
                    onClick={whoseOrder}
                    type='Pass'
                    disabled={order === lastOrder}
                />
                <div style={{ width: '45px' }}></div>
                <PrimaryButton
                    content={`${t('LUCKYMAN_MODAL_SHUT_BUTTON')}`}
                    onClick={shutCards}
                    type='Shut'
                    disabled={!isShutVisible}
                />
                {/* <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    // disabled={!isShutVisible}
                    className={classes.mainBtn}
                    onClick={recommandCards}
                >
                    {`${t('LUCKYMAN_MODAL_RECOMMAND_BUTTON')}`}
                </Button> */}
            </div>
            <div className={classes.exitBtn}>
                <PrimaryButton
                    content={exitflg ? "Cancel" : "Exit"}
                    onClick={exitFunc}
                    type='Exit'
                />
            </div>
            <div style={{position:'absolute', width: effectOpen?"100%":'0%', height: effectOpen?"100%":'0%'}}>
                <TaSoEffect
                    isOpen={effectOpen}
                    kind={effectkind}
                />
            </div>
            <ResultModal
                isOpen={isResultModalOpen}
                setClose={() => setResultModalOpen(false)}
                isVictory={username === winner}
                previousBounty={previousBounty}
                updatedBounty={bounty}
            />
        </div>
    )
}

export default LuckyMan;