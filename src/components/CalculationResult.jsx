import React from 'react';

const CalculationResult = ({description, price}) => {
    return (
        <div className="info__summary">
            <div className="info__summary-description gilroy-font">{description}</div>
            <div className="info__summary-price bold-font bold-font-mobile">
                <span>{price}</span>
                <span>&nbsp;₽</span>
            </div>
        </div>
    );
};

export default CalculationResult;