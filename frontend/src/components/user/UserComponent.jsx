import { Avatar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import DelayingAppearance from '../delayingappearance/DelayingAppearance';
import CardComponent from '../cards/CardComponent';

import './UserComponent.css';

const UserComponent = (props) => {
    const [showBanner, setShowBanner] = useState(false);
    useEffect(() => {
        if (props.isPass) {
            setShowBanner(true);
            setTimeout(() => setShowBanner(false), 2000)
        }
    }, [props.isPass])
    const useStyles = makeStyles({
        userContainer: {
            display: "flex",
            flexDirection: "row",
            position: "relative" && "absolute",
            top: props.userPos?.y,
            left: props.userPos?.x,
        },
        avatar: {
            width: 90,
            height: 90,
            boxShadow: props.order ? "0px 0px 10px white" : "",
            userSelect: 'none',
        },
        avatarArea: {
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundSize: 'cover',
            width: 140,
            height: 155,
            userSelect: 'none',
        },
        username: {
            color: props.host ? "#00aeff" : "white",
            fontSize: 30,
            fontWeight: "bold",
            textDecoration: props.exitReq ? "line-through black" : '',
            zIndex: 1,
            marginTop: -10,
            userSelect: 'none',
        },
        remainCnt: {
            fontSize: 18,
            color: "white",
            fontWeight: "bold",
            backgroundColor: "#1f082b",
            width: 25,
            height: 25,
            borderRadius: 3,
            marginLeft: 8,
            marginBottom: 2,
            zIndex: 1,
            textAlign: 'center',
            userSelect: 'none',
        },
        passBanner: {
            left: props.dropPos?.x,
            top: props.dropPos?.y,
            color: "#00aeff",
            fontSize: 70,
            fontStyle: "italic",
            fontWeight: "bold",
            position: 'fixed',
            textShadow: '2px 2px 2px black',
            visibility: showBanner ? "visible" : "hidden",
            zIndex: 20,
            userSelect: 'none',
        },
        exitreq: {
            position: 'absolute',
            width: 250,
            zIndex: 0,
            visibility: props.exitReq ? "visible" : "hidden",
            marginTop: -5,
            userSelect: 'none',
        },
        cardArea: {
            position: "absolute",
            top: 60,
            left: 400 - props.havingCardsArray?.length * 10,
        }
    });
    const classes = useStyles();

    return (
        <div className={classes.userContainer}>
            <div className='cardArea' style={{ position: "fixed", top: `${props.dropPos?.y}px`, left: `${props.dropPos?.x}px` }}>
                {props.droppingCardsArray?.map((item, index) => {
                    return (
                        <CardComponent
                            key={index}
                            index={index}
                            number={item.number}
                            kind="drop"
                            type={item.type}
                            order={props.order}
                            lastOrder={props.lastOrder}
                            selfCard={false}
                        />)
                })}
            </div>
            <div className={classes.passBanner}> pass</div>
            <div className='sortcolumn'>
                <div className={classes.avatarArea} style={{ backgroundImage: `url("/assets/background/avatar_bg.png")` }}>
                    <IconButton >
                        <Avatar src={props.src} className={classes.avatar} />
                    </IconButton>
                    <div className='delayingAppearance'>
                        <DelayingAppearance
                            counterCnt={props.counterCnt}
                            visible={props.order && props.isStart}
                        />
                    </div>
                </div>
                <div className="infoArea">
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <img className={classes.exitreq} src="/assets/background/exitreq_bg.png" alt='exitres_bg\'></img>
                        <div className={classes.username} >{props.username}</div>
                        {!props.cardVisible && props.isStart ? <div className={classes.remainCnt}>
                            {props.havingCardsArray?.length}
                        </div> : <div></div>}
                    </div>
                    <div className="sortrow">
                        <img src={'/gold.png'} alt='gold' style={{ height: '20px', width: '20px', userSelect: 'none' }} />
                        <div className="bounty" >{props.bounty}</div>
                    </div>
                </div>
            </div>
            <div className={classes.cardArea}>
                {props.cardVisible && props.havingCardsArray?.map((item, index) => {
                    return (
                        <CardComponent
                            key={index}
                            index={index}
                            number={item.number}
                            type={item.type}
                            kind="have"
                            cardActive={true}
                            order={props.order}
                            lastOrder={false}
                            selfCard={true}
                        />)
                })}
            </div>
        </div >
    )
}

export default UserComponent;