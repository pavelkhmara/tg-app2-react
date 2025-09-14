import React, { useEffect } from 'react';
import './Form.css';
import { useTelegram } from '../../hooks/useTelegram';

const Form = () => {
    const [ country, setCountry ] = React.useState('');
    const [ street, setStreet ] = React.useState('');
    const [ subject, setSubject ] = React.useState('physical');
    const { tg } = useTelegram();

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Send data'
        });
    });

    useEffect(() => {
        if(!street || !country) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [country, street]);

    const onChangeCountry = (e) => {
        setCountry(e.target.value);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value);
    }

    const onChangeSubject = (e) => {
        setSubject(e.target.value);
    }

  return (
    <div>
      <h3>Type information</h3>
        <input className={'input'} type="text" placeholder='Country' value={country} onChange={onChangeCountry} />
        <input className={'input'} type="text" placeholder='Street' value={street} onChange={onChangeStreet} />
        <select className={'select'} value={subject} onChange={onChangeSubject}>
            <option value={'physical'}>Individual</option>
            <option value={'legal'}>Company</option>
        </select>
        <button className={'button'}>Send</button>
    </div>
  );
};

export default Form;