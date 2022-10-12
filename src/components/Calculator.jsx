import React, {useEffect} from 'react';
import Slider from "../components/Slider";
import {useState} from "react";
import {inputConverter} from "../utils/InputConverter";
import CalculationResult from "../components/CalculationResult";
import Preloader from '../components/Preloader.svg'

const Calculator = () => {

    const minDefaultPrice = 1000000
    const maxDefaultPrice = 6000000
    const initialSliderValue = 3300000
    const initialPercent = 0.13
    const initialMonth = 60
    const initialPayment = initialSliderValue * initialPercent
    const initialCustomPrice = inputConverter(initialSliderValue)
    const initialCustomPayment = inputConverter(initialPayment)


    const [price, setPrice] = useState(initialSliderValue)
    const [payment, setPayment] = useState(initialPayment)
    const [percent, setPercent] = useState(initialPercent)
    const [months, setMonths] = useState(initialMonth)
    const [customPriceValue, setCustomPriceValue] = useState(initialCustomPrice)
    const [customPaymentValue, setCustomPaymentValue] = useState(initialCustomPayment)
    const [isDisabled, setIsDisabled] = useState(false)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        const newPayment = Math.floor(price * initialPercent)
        setPayment(newPayment)
        setPercent(initialPercent)
        setCustomPaymentValue(inputConverter(newPayment))
    }, [price])


    const costRange = {min: minDefaultPrice, max: maxDefaultPrice}
    const percentRange = {min: Math.round(price * 0.1), max: Math.round(price * 0.6)}
    const monthRange = {min: 1, max: 60}
    const ruble = '₽'
    const monthUnit = 'мес.'
    const progressBarPrice = (value) => ((value - minDefaultPrice) / minDefaultPrice * 100) / 5
    const progressBarPayment = (value) => ((value - (price * 0.1)) / (price * 0.1) * 100) / 5
    const progressBarMonth = (value) => ((value - 1 )/ 59 * 100)


    const monthPay = Math.round((price - payment) * ((0.035 * Math.pow((1 + 0.035), months)) / (Math.pow((1 + 0.035), months) - 1)))
    const countTotalPrice = payment + months * monthPay

    const sendDataOnServ = () => {
        const body = {
            "car_coast": price,
            "initail_payment": payment,
            "initail_payment_percent": percent,
            "lease_term": months,
            "total_sum": countTotalPrice,
            "monthly_payment_from": monthPay
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }
        setIsFetching(true)
        fetch('https://hookb.in/eK160jgYJ6UlaRPldJ1P', requestOptions)
            .then(response => response.json())
            .then(data => {
                setIsFetching(false)
                console.log(data)
            })
            .catch(e => {
                setIsFetching(false)
                alert(e)
            })
    }

    return (
        <>
            <main className="calculation">
                <Slider description='Стоимость автомобиля'
                        unit={ruble}
                        range={costRange}
                        progressBar={progressBarPrice}
                        value={price}
                        setValue={setPrice}
                        isFetching={isFetching}
                        customValue={customPriceValue}
                        setCustomValue={setCustomPriceValue}
                        setIsDisabled={setIsDisabled}/>

                <Slider description='Первоначальный взнос'
                        unit={percent}
                        range={percentRange}
                        progressBar={progressBarPayment}
                        value={payment}
                        setValue={setPayment}
                        isFetching={isFetching}
                        customValue={customPaymentValue}
                        setCustomValue={setCustomPaymentValue}
                        setPercent={setPercent}
                        isDisabled={isDisabled}/>

                <Slider description='Срок лизинга'
                        unit={monthUnit}
                        range={monthRange}
                        progressBar={progressBarMonth}
                        value={months}
                        setValue={setMonths}
                        isFetching={isFetching}/>
            </main>
            <footer className="footer">
                <div className="info">
                    <CalculationResult description='Сумма договора лизинга' price={inputConverter(countTotalPrice)}/>
                    <CalculationResult description='Ежемесячный платеж от' price={inputConverter(monthPay)}/>
                </div>
                    {!isFetching
                        ?
                        <button className='info__button info__button-active' onClick={sendDataOnServ}>
                            <p className='bold-font font-button'>
                                Оставить заявку
                            </p>
                        </button>
                        :
                        <button className='info__button' disabled>
                            <img className='info__button-preloader' src={Preloader} alt='preloader'/>
                        </button>}
            </footer>
        </>
    );
};

export default Calculator;