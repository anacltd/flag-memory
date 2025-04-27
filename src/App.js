import { useState, useEffect } from 'react'
import Form from './components/Form'
import MemoryCard from './components/MemoryCard'
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegularButton from './components/RegularButton';


const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

function getRandomItems(arr, n) {
    const shuffledArray = arr.sort(() => 0.5 - Math.random());
    return shuffledArray.slice(0, n);
}

export default function App() {
    const [isGameOn, setIsGameOn] = useState(false)
    const [emojisData, setEmojisData] = useState([])
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [disableClick, setDisableClick] = useState(false);
    const [tries, setTries] = useState(0);

    async function startGame(count) {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const dataSample = getRandomItems(data, count);
            const emojisArray = getEmojisArray(dataSample)
            setEmojisData(emojisArray)

        } catch (error) {
            console.error('Error:', error);
            return null;
        }

        setIsGameOn(true)
        setFlippedCards([]);
        setMatchedPairs([]);
        setTries(0);
    }


    function getEmojisArray(data) {
        const cards = [];

        data.forEach((country) => {
        cards.push({
            type: 'flag',
            value: country.flag,
            matchKey: country.name.common,
        });

        cards.push({
            type: 'capital',
            value: country.capital[0],
            matchKey: country.name.common,
        });
        });

        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = cards[i]
            cards[i] = cards[j]
            cards[j] = temp
        }
        return cards
    }

    function turnCard(index) {
        if (disableClick || flippedCards.includes(index) || matchedPairs.flat().includes(index)) {
            return;
        }
    
        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);
    
        if (newFlipped.length === 2) {
            setDisableClick(true);
            setTries(prevTries => prevTries + 1);
    
            setTimeout(() => {
                const [firstIndex, secondIndex] = newFlipped;
                const firstCard = emojisData[firstIndex];
                const secondCard = emojisData[secondIndex];

                if (firstCard && secondCard && firstCard.matchKey === secondCard.matchKey) {

                    const newColor = getRandomColor();
                    setMatchedPairs(prev => {
                        const updatedPairs = [...prev, [firstIndex, secondIndex, newColor]];
                        return updatedPairs;
                    });
                }
                setFlippedCards([]);
                setDisableClick(false);
            }, 800);
        }
    }

    useEffect(() => {
        if (matchedPairs.length === emojisData.length / 2 && emojisData.length > 0) {
            toast.success(`🎉 You matched 'em all in ${tries} tries! 🎉`);
        }
    }, [matchedPairs, emojisData, tries]);

    const handlePlayAgain = () => {
        setIsGameOn(false);
        setEmojisData([]);
        setFlippedCards([]);
        setMatchedPairs([]);
        setDisableClick(false);
        setTries(0);
    };


    return (
        <main>
          <h1>Flag memory</h1>
          {!isGameOn && <Form handleSubmit={startGame} />}
          {isGameOn && (
            <>
              <MemoryCard
                handleClick={turnCard}
                data={emojisData}
                flippedCards={flippedCards}
                matchedPairs={matchedPairs}
              />
              {matchedPairs.length === emojisData.length / 2 && (
                <RegularButton handleClick={handlePlayAgain}>
                  Play Again
                </RegularButton>
              )}
            </>
          )}
          <ToastContainer />
        </main>
      )

}