import React, { useState, useEffect, memo } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function removeSpecialCharacters(str) {
  return str.replace(/[^\w\s]/g, " ");
}

const Highlighted = ({ text = "", input = "" }) => {
  const [textProgress, setTextProgress] = useState("");
  // const [difference, setDifference] = useState(text);

  useEffect(() => {
    if (!input) return;

    const cleanedInput = removeSpecialCharacters(input);
    const cleanedText = removeSpecialCharacters(text);

    const regex = new RegExp("^" + cleanedInput, "i");

    console.log("cleanedText ", cleanedText);
    console.log("cleanedInput ", cleanedInput);

    if (regex.test(cleanedText)) {
      setTextProgress(input);
      // setDifference(text.replace(regex, ""));
    }
  }, [input, text]);

  return (
    <div>
      <span style={{ backgroundColor: "yellow" }}>{textProgress}</span>
      {/* <span> {difference}</span> */}
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

  const text = "i want to check, if there's any problem, what do you think?";

  return (
    <div className="container">
      <div>What you said: {transcript}</div>
      <hr />

      <div>{text}</div>

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
