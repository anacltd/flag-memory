import { useState } from "react";
import RegularButton from './RegularButton';
import './Form.css'


export default function Form({ handleSubmit }) {
    const [pairsCount, setPairsCount] = useState(6);

    const pairOptions = [2, 4, 6, 8, 10, 12, 15, 20];

    function onSubmit(event) {
        event.preventDefault();
        handleSubmit(pairsCount);
    }

    return (
        <div className="form-container">
            <form className="wrapper" onSubmit={onSubmit}>
                <div className="field">
                    <label htmlFor="pairs">How many pairs?</label>
                    <select
                        id="pairs"
                        value={pairsCount}
                        onChange={(e) => setPairsCount(Number(e.target.value))}
                    >
                        {pairOptions.map((num) => (
                            <option key={num} value={num}>
                                {num} pairs
                            </option>
                        ))}
                    </select>
                    <RegularButton>Start</RegularButton>
                </div>
            </form>
        </div>
    );
}