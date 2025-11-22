import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { useDispatch } from 'react-redux'
import { handlePushCard, handlePopCard } from '../redux/actions/card';

export default function CardComponent(props) {
    const [isCardChoosed, setCardChoosed] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        setCardChoosed(false);
    }, [props.order])

    const cardClick = () => {
        if (!isCardChoosed)
            dispatch(handlePushCard(props.type, props.number))
        else dispatch(handlePopCard(props.type, props.number))
        setCardChoosed(() => !isCardChoosed)
    }

    const useStyles = makeStyles({
        card: {
            top: isCardChoosed ? 0 : 15,
            left: props.index * 40,
            zIndex: props.index + 2,
            cursor: "pointer",
            boxShadow: "2px 2px 5px black",
            position: 'absolute',
            '&:hover': {
                boxShadow: "0px 0px 10px lightblue",
            },
        },
        cardactive: {
            top: 15,
            left: props.isCoveredCard || props.kind === "drop" ? props.index * 25 : props.index * 40,
            zIndex: props.index,
            boxShadow: "2px 2px 5px black",
            position: 'absolute',
            // border: props.lastOrder ? "3px solid red" : "",
            // borderRadius: props.lastOrder ? "5px" : "",
        },
        media: {
            width: props.selfCard || props.lastOrder ? 100 : 80,
            height: props.selfCard || props.lastOrder ? 130 : 104,
        },
    });

    const classes = useStyles();
    return (
        <Card
            className={props.order && props.selfCard ? classes.card : classes.cardactive}
        >
            <CardMedia
                className={classes.media}
                image={!props.isCoveredCard ? `/assets/cards/${props.type}-${props.number}.png` : '/assets/cards/coveredCardBg.png'}
                onClick={props.order && props.cardActive ? cardClick : null}
            />
        </Card>
    );
}
