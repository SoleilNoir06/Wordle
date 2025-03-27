import React from 'react';

const Keyboard = ({ onKeyPress, usedLetters }) => {
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    return (
        <div className="keyboard">
            {keys.map((row, i) => (
                <div key={i} className="keyboard-row">
                    {row.map(key => (
                        <button
                            key={key}
                            onClick={() => onKeyPress(key)}
                            className={usedLetters[key] ? 'used' : ''}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;