import React from 'react';
import './Slider.scss'
import {inputConverter} from "../utils/InputConverter";



const Slider = ({   description,
                    unit,
                    range,
                    progressBar,
                    value,
                    setValue,
                    isFetching,
                    customValue = null,
                    setCustomValue = null,
                    setIsDisabled = null,
                    setPercent = null, isDisabled = null}) => {


    const getBackgroundRage = () => {
        return value < range.min
            ?
            { backgroundSize: `0% 100%`}
            :
            { backgroundSize: `${Math.round(progressBar(value))}% 100%`}
    }

    const getRublePosition = () => {
        return !isNaN(unit) && String(value).length > 6
    }

    const calculateInputLength = (value) => {
        if(isNaN(value)) return false
        return unit === 'мес.'
            ?
            String(value).length < 3
            :
            String(value).length < 8
    }

    const numToPercent = (value) => Math.floor(value * 100) + '%'

    const handleInput = (e) => {
        if(unit === '₽') {
            setIsDisabled(true)
            setTimeout(() => {
                setIsDisabled(false)
            }, 50)
        }
        setValue(e.target.valueAsNumber)
        if(setCustomValue) {
            const convertedValue = inputConverter(e.target.valueAsNumber)
            setCustomValue(convertedValue)
        }
        if(setPercent) {
            const percent = e.target.valueAsNumber / range.min /10
            setPercent(+percent.toFixed(2))
        }
    }

    const handleTextInput = (e) => {

        const number = +e.target.value.replace(/\s/g, '')

        if(unit === '₽' && calculateInputLength(number)) {
            setIsDisabled(true)
            setTimeout(() => {
                setIsDisabled(false)
            }, 50)
        }
        if(!isNaN(number) && calculateInputLength(number)) {
            setValue(number)
            if(setCustomValue) {
                const convertedValue = inputConverter(number)
                setCustomValue(convertedValue)
            }
            if(setPercent) {
                const percent = number / range.min /10
                setPercent(+percent.toFixed(2))
            }
        }
    }

    const handleBlur = () => {
        if(value < range.min) {
            setValue(range.min)
            if(setCustomValue) {
                const convertedValue = inputConverter(range.min)
                setCustomValue(convertedValue)
            }
            if(setPercent)
                setPercent(0.1)
        }
        if(value > range.max) {
            setValue(range.max)
            if(setCustomValue) {
                const convertedValue = inputConverter(range.max)
                setCustomValue(convertedValue)
            }
            if(setPercent)
                setPercent(0.6)
        }
    }


    return (
        <div className={isFetching ? "calculation__price calculation__price-disabled" : "calculation__price"}>
            <div className="calculation__price-description gilroy-font">{description}</div>

            <input className={isFetching ? "calculation__price-input bold-font-small" : "calculation__price-input bold-font-small input-hover"}
                   type="text" value={customValue ? customValue : value}
                   onBlur={handleBlur}
                   onChange={handleTextInput}
                   disabled={isFetching}/>

            <div className="calculation__price-range">
                {!isNaN(unit) && isDisabled
                    ?
                    <input
                    className="slider"
                    type="range"
                    value={700000}
                    onChange={handleInput}
                    min={100000}
                    max={10000000}
                    style={{ backgroundSize: `6% 100%`}}
                />
                :
                    <input
                        className={isFetching ? "slider slider-inactive" : "slider"}
                        type="range"
                        value={value}
                        onChange={handleInput}
                        min={range.min}
                        max={range.max}
                        style={getBackgroundRage()}
                        disabled={isFetching}
                    />
                }
                <span></span>
            </div>
            {!isNaN(unit)
                ?
                <>
                    <div className='percent-wrapper'>
                        <div className="bold-font-tiny">
                            {numToPercent(unit)}
                        </div>
                    </div>
                    <div className={getRublePosition() ? "currency currency-position bold-font-small" : "currency bold-font-small"}>
                        ₽
                    </div>
                </>
                :<div className={unit === 'мес.' ? "month unit bold-font-small" : "unit bold-font-small"}>
                    {unit}
                </div>}
        </div>
    );
};

export default Slider;