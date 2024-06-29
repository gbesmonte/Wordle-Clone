import { useState, useEffect } from "react";
import Guess from "./Guess.tsx";
import LetterBank from "./LetterBank.tsx";
import Header from "./Header.tsx";
import RICIBs from 'react-individual-character-input-boxes';

export default function Wordle() {
  //Interfaces
  interface Letter {
    text: string;
    color: string;
    isGuessed: boolean;
  }

  const LIGHT_GRAY = "#d3d6da";
  const YELLOW = "#c9b458";
  const DARK_GRAY = "#787c7e";
  const GREEN = "#6aaa64";

  //State variables
  const [newGuess, setNewGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [solution, setSolution] = useState("");
  const [letterObjs, setLetterObjs] = useState<Array<Array<Letter>>>([[]]);
  const [alphabetLetterObjs, setAlphabetLetterObjs] = useState<Array<Letter>>(
    [],
  );
  const [isResetEnabled, setIsResetEnabled] = useState<boolean>(false);
  const [guessesLeft, setGuessesLeft] = useState(6);
  const [gameStatus, setGameStatus] = useState("");

  //Other variables
  const alphabet = "qwertyuiopasdfghjklzxcvbnm";
  const alphabetLetters = alphabet.split("");
  const randomNumber = Math.floor(Math.random() * 3103);

  let solutionSet = new Set(solution);

  //Function: Fetches the list of possible words
  async function getData() {
    const response = await fetch("words.txt");
    const text = await response.text();
    const lines = text.split("\n");
    setSolution(lines[randomNumber]);
  }
  useEffect(() => {
    getData();
    setUpAlphabet();
  }, []);

  //Function: Creates an array of Letters for every letter of the alphabet
  function setUpAlphabet() {
    const alphabetTemp: Letter[] = [];
    alphabetLetters.map((x) => {
      const obj: Letter = {
        text: x,
        color: LIGHT_GRAY,
        isGuessed: false,
      };
      alphabetTemp.push(obj);
    });
    setAlphabetLetterObjs(alphabetTemp);
  }

  //Function: Changes newGuess with user input
  function handleGuessChange(e) {
    setNewGuess(e.target.value);
  }

  //Function: Allows for enter key
  function handleKeyDown(e) {
    console.log(e);
    if (e.keyCode === 13) {
      makeNewGuess();
    } else {
      console.log("WRONG KEY");
    }
  }

  //Function: Adds newGuess to guesses
  function makeNewGuess() {
    if (isGuessValid()) {
      createGuessLetterObjList();
      setGuesses([...guesses, newGuess]);
      setNewGuess("");
      checkWin();
      checkGuesses();
      setGuessesLeft((g) => --g);
      //console.log(guessesLeft);
    }
  }

  //Function: Creates what we pass to Guess
  function createGuessLetterObjList() {
    const word = newGuess;
    const letters = word.split("");
    const newLetterObjs: Letter[] = [];

    letters.map((x) => {
      const obj: Letter = {
        text: x,
        color: DARK_GRAY,
        isGuessed: true,
      };
      newLetterObjs.push(obj);
    });

    newLetterObjs.map((x, i) => {
      if (x.text === solution[i]) {
        x.color = GREEN;
      } else if (solutionSet.has(x.text)) {
        x.color = YELLOW;
      } else {
        x.color = DARK_GRAY;
      }
    });
    updateAlphabetObjs(newLetterObjs);
    setLetterObjs([...letterObjs, newLetterObjs]);
  }

  //Function: Updates the keyboard with new guess
  function updateAlphabetObjs(newLetterObjs: Letter[]) {
    const abtemp = [...alphabetLetterObjs];
    abtemp.map((x) => {
      for (let i = 0; i < newLetterObjs.length; i++) {
        if (newLetterObjs[i].text === x.text) {
          if (x.color !== GREEN) {
            x.color = newLetterObjs[i].color;
            setAlphabetLetterObjs(abtemp);
          }
        }
      }
    });
  }

  //Function: Checks for game win
  function checkWin() {
    if (newGuess === solution.trim()) {
      console.log("Game won");
      setGameStatus("YOU WIN");
      setIsResetEnabled(true);
    }
  }

  //Function: Checks if we still have guesses
  function checkGuesses() {
    if (guessesLeft === 1) {
      console.log("Game lost");
      setGameStatus("YOU LOSE");
      setIsResetEnabled(true);
    }
  }

  //Function: Check if guess is valid
  function isGuessValid() {
    if (newGuess.length !== 5) {
      return false;
    }
    return true;
  }

  //Function: Reset Game
  function resetGame() {
    setNewGuess("");
    setGuesses([]);
    getData();
    setLetterObjs([[]]);
    setUpAlphabet();
    solutionSet = new Set(solution);
    setIsResetEnabled(false);
    setGuessesLeft(6);
    setGameStatus("");
  }

  function handleOutput(a){
    setNewGuess(a);
  }

  return (
    <>
      <Header />
      <div className="wordle">
        <div className="guesses">
          {letterObjs.map((x, i) => (
            <Guess key={i} letterObjs={x} />
          ))}
        </div>
        <input
          type="text"
          placeholder="Enter guess"
          value={newGuess}
          onChange={handleGuessChange}
          disabled={isResetEnabled}
          onKeyDown={handleKeyDown}
        />
        <LetterBank alphabet={alphabetLetterObjs} />
        {guessesLeft !== 0 ? (
          <p>Guesses Left: {guessesLeft}</p>
        ) : (
          <p>{gameStatus}</p>
        )}
        {gameStatus === "YOU LOSE" && <p>Answer: {solution} </p>}
        <button disabled={!isResetEnabled} onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </>
  );
}
