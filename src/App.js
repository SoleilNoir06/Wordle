import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import Message from './components/Message';
import './App.css';

const App = () => {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [usedLetters, setUsedLetters] = useState({});

  // Récupérer un mot aléatoire au chargement
  useEffect(() => {
    const fetchRandomWord = async () => {
      try {
        const response = await fetch('/api/random-word');
        const { word } = await response.json();
        setTargetWord(word);
        console.log('Mot à trouver:', word); // Pour débogage
      } catch (error) {
        console.error('Erreur:', error);
        // Solution de secours si l'API échoue
        const backupWords = ['APPLE', 'BEACH', 'CRANE', 'DANCE', 'EAGLE'];
        setTargetWord(backupWords[Math.floor(Math.random() * backupWords.length)]);
      }
    };
    fetchRandomWord();
  }, []);

  // Gestion du clavier physique
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      // Si le jeu est terminé, ne rien faire
      if (guesses.includes(targetWord)) return;

      // Touche Backspace
      if (key === 'BACKSPACE' || key === 'DELETE') {
        setCurrentGuess(prev => prev.slice(0, -1));
        return;
      }

      // Touche Entrée
      if (key === 'ENTER') {
        if (currentGuess.length === 5) {
          // Vérifier si le mot existe (optionnel)
          // Ici vous pourriez ajouter une vérification API

          setGuesses(prev => [...prev, currentGuess]);

          // Mettre à jour les lettres utilisées
          const newUsedLetters = { ...usedLetters };
          currentGuess.split('').forEach(letter => {
            newUsedLetters[letter] = true;
          });
          setUsedLetters(newUsedLetters);

          setCurrentGuess('');
        } else {
          setMessage('Le mot doit faire 5 lettres !');
          setTimeout(() => setMessage(''), 2000);
        }
        return;
      }

      // Lettres (A-Z)
      if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess(prev => prev + key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, targetWord, usedLetters]);

  // Gestion du clavier virtuel
  const handleVirtualKeyPress = (key) => {
    if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        setGuesses(prev => [...prev, currentGuess]);
        setCurrentGuess('');
      } else {
        setMessage('Le mot doit faire 5 lettres !');
        setTimeout(() => setMessage(''), 2000);
      }
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  };

  // Vérification des lettres (pour le style)
  const checkLetter = (letter, index, guess) => {
    if (!targetWord) return '';

    // Lettre correcte et bien placée
    if (targetWord[index] === letter) return 'correct';

    // Lettre correcte mais mal placée
    if (targetWord.includes(letter)) return 'present';

    // Lettre absente
    return 'absent';
  };
  return (
    <div className="App">
      <h1>Wordle</h1>
      <Message message={message} />
      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        checkLetter={checkLetter}
      />
      <Keyboard
        onKeyPress={handleVirtualKeyPress}
        usedLetters={usedLetters}
      />
      <button
        onClick={() => console.log('Mot actuel:', targetWord)}
        style={{ position: 'absolute', top: 10, right: 10 }}
      >
        🐞 Debug
      </button>
    </div>
  );
};

export default App;