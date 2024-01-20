import React, { useEffect } from 'react'
import "../Styles/Notify.css";

interface notifyProps {
    setNotify: (active: boolean) => void,
    message: string
}

const Notify = ({ setNotify, message }: notifyProps) => {
    useEffect(() => { setTimeout(() => setNotify(false), 2500) });

    return (
        <div className='notify'>
            {message}
        </div>
    )
}

export default Notify;
