import React from 'react';
import './MemoryCard.css';

export default function MemoryCard({ data, handleClick, flippedCards, matchedPairs }) {
    return (
        <ul className="card-container">
            {data.map((card, index) => {
                const isFlipped = flippedCards.includes(index) || matchedPairs.flat().includes(index);
                const matchedPair = matchedPairs.find(pair => pair[0] === index || pair[1] === index);
                const isMatched = !!matchedPair;
                const matchColor = matchedPair ? matchedPair[2] : null;
                const typeClass = card.type === 'flag' ? 'btn--emoji--flag' : 'btn--emoji--capital';

                return (
                    <li key={index} className="card-item">
                        <div
                            className={`card-inner ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                            style={isMatched
                                ? {
                                      border: `4px solid ${matchColor}`,
                                      boxShadow: `inset 0 0 20px 20px ${matchColor}`
                                  }
                                : {}
                            }
                        >
                            <div className="card-face card-front">
                                <button
                                    className="btn btn--emoji btn--emoji--front"
                                    onClick={() => handleClick(index)}
                                >
                                    ❓
                                </button>
                            </div>
                            <div className={`card-face card-back`}>
                                <button
                                    className={`btn btn--emoji btn--emoji--back ${typeClass}`}
                                    tabIndex={-1}
                                >
                                    {card.value}
                                </button>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}