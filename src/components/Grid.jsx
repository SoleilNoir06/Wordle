import React from 'react';

const Grid = ({ guesses, currentGuess, checkLetter }) => {
    const rows = 6;
    const cols = 5;

    return (
        <div className="board">
            {Array.from({ length: rows }).map((_, rowIndex) => {
                // Si c'est une ligne déjà jouée
                if (rowIndex < guesses.length) {
                    return (
                        <div key={rowIndex} className="row">
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`cell ${checkLetter(guesses[rowIndex][colIndex], colIndex, guesses[rowIndex])}`}
                                >
                                    {guesses[rowIndex][colIndex]}
                                </div>
                            ))}
                        </div>
                    );
                }

                // Si c'est la ligne en cours
                if (rowIndex === guesses.length) {
                    return (
                        <div key={rowIndex} className="row">
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <div key={colIndex} className="cell">
                                    {currentGuess[colIndex] || ''}
                                </div>
                            ))}
                        </div>
                    );
                }

                // Lignes vides
                return (
                    <div key={rowIndex} className="row">
                        {Array.from({ length: cols }).map((_, colIndex) => (
                            <div key={colIndex} className="cell"></div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default Grid;