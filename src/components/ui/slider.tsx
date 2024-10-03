import React from 'react';
import '../../styles.css';

export const Slider: React.FC<{
    id: string;
    value: number[];
    min: number;
    max: number;
    step: number;
    onValueChange: (value: number[]) => void;
    className?: string;
}> = ({ id, value, min, max, step, onValueChange, className }) => {
    return (
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={(e) => onValueChange([Number(e.target.value)])}
            className={`slider ${className} slider-custom`}
            style={{ width: '200px', marginLeft: '10px', marginRight: '10px' }}
        />
    );
};
