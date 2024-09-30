import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

function App() {
  const [search, setSearch] = useState("");
  const [definition, setDefinition] = useState(null);
  const [example, setExample] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null); 
  const audioRef = useRef(null); // Reference to the audio element

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmitButton = async () => {
    if (search.trim() !== "") {
      await fetchMeanings(search);
    }
  };

  const fetchMeanings = async (word) => {
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Word not found");
      }

      const data = await response.json();
      console.log(data);

      const meaning = data[0].meanings[0].definitions[0];
      setDefinition(meaning.definition);
      setExample(meaning.example);

      const audio = data[0].phonetics.find((phonetic) => phonetic.audio);
      setAudioUrl(audio ? audio.audio : null);
    } catch (error) {
      setDefinition("Definition not found.");
      setExample(null);
      setAudioUrl(null);
      console.error("Error fetching word:", error);
    }                                                         
  };

  // Function to handle audio play
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <>
      <div className="main container">
        <h3>The Word Search</h3>
        <div className="centeredDiv container">
          <div className="inputContainer container">
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              placeholder="Enter the word you want to search"
              className="SearchWord form-control"
            />
            <button 
              type="button" 
              className="btn btn-primary mt-2"
              onClick={handleSubmitButton}
            >
              Search
            </button>
          </div>
          <div className="content mt-4">
            <p className="definition">
              {definition ? (
                <strong>Definition:</strong>
              ) : (
                "Please enter a word and click search"
              )}
              <br />
              {definition}
            </p>
            {example && (
              <span className="example">
                <strong>Example:</strong> {example}
              </span>
            )}

            {/* Audio Icon */}
            {audioUrl && (
              <div className="audio mt-3">
                <strong>Pronunciation:</strong>
                <i 
                  className="fas fa-volume-up audio-icon ml-2" 
                  style={{ cursor: 'pointer', fontSize: '24px' }} 
                  onClick={playAudio}
                ></i>
                <audio ref={audioRef} src={audioUrl} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
