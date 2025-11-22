import React, { useContext, useEffect } from 'react'
import LoginIconButton from '../../components/buttons/LoginIconButton';
import './Welcome.css'
import { Logincontext } from '../../components/contexts/Logincontext';
import PrimaryButton from '../../components/buttons/PrimaryButton';


const Welcome = () => {

    const loginContext = useContext(Logincontext);
    const { setLoginModalOpen } = loginContext;

    useEffect(() => {
        setLoginModalOpen(true);
    }, [setLoginModalOpen])


    return (
        <div className=" wel_container">
            <div className='loginbtn' >
                <LoginIconButton showModal={() => setLoginModalOpen(true)} />
            </div>
            <div className='loginbtn_responsive'>
                <PrimaryButton content="Sing in" onClick={() => setLoginModalOpen(true)} type='Create_room' />
            </div>
        </div>
    )
}

export default Welcome;