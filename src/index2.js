import React, { useState, useEffect, memo } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function removeSpecialCharacters(str) {
  return str.replace(/[^\w\s]/g, "");
}

const Highlighted = ({ text = "", input = "" }) => {
  const [textProgress, setTextProgress] = useState("");
  const [difference, setDifference] = useState(text);

  useEffect(() => {
    if (!input) return;

    const inputWords = input.split(" ");
    const lastWordSpoken = inputWords[inputWords.length - 1];

    let newPartOfThePhrase = "";

    if (!!textProgress) {
      newPartOfThePhrase = [textProgress, lastWordSpoken].join(" ");
    } else {
      newPartOfThePhrase = lastWordSpoken;
    }

    const cleanedText = removeSpecialCharacters(text);
    const cleanedInput = removeSpecialCharacters(newPartOfThePhrase);

    const regex = new RegExp("^" + cleanedInput, "i");

    if (regex.test(cleanedText)) {
      setTextProgress(newPartOfThePhrase);

      const regex2 = new RegExp("^" + newPartOfThePhrase, "i");
      setDifference(text.replace(regex2, ""));
    }
  }, [input, text, textProgress, difference]);

  return (
    <div>
      <span style={{ backgroundColor: "yellow" }}>{textProgress}</span>
      <span>{difference}</span>
    </div>
  );
};

Highlighted.defaultProps = {
  text: "",
  input: "",
};

const MemoizedHighlighted = memo(Highlighted);

const App = () => {
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  const { transcript } = useSpeechRecognition();

  const text = "i want to check if there's any problem, what do you think?";

  return (
    <div className="container">
      <div>{transcript}</div>
      <hr />
      <MemoizedHighlighted text={text} input={transcript} />

      <div className="btn-style">
        <button onClick={startListening}>Start Listening</button>
        <button onClick={SpeechRecognition.stopListening}>
          Stop Listening
        </button>
      </div>
    </div>
  );
};

export default App;
