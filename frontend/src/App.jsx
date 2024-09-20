// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import Chat from "./components/Chat";

// function App() {
//   return (
//     <div>
//       <h1 className="text-center text-3xl leading-relaxed font-semibold bg-orange-500">
//         Chatbot
//       </h1>
//       <div className="flex-auto m-5 p-5 text-center">
//         <Chat />
//       </div>
//     </div>
//   );
// }

// export default App;

// import { useState, useRef, useEffect } from "react";
// import axios from "axios";

// function App() {
//   const [chat, setChat] = useState([]);
//   const [question, setQuestion] = useState("");
//   const [fontSize, setFontSize] = useState(16); // Initial font size
//   const [audioUrl, setAudioUrl] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const audioRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);
//   // Handle font size change with slider
//   const handleFontSizeChange = (e) => {
//     setFontSize(e.target.value);
//   };

//   // Handle user input
//   const handleInputChange = (e) => {
//     setQuestion(e.target.value);
//   };

//   // Send question to Flask backend
//   const sendQuestion = async () => {
//     if (question.trim() === "") return;

//     try {
//       const response = await axios.post("http://localhost:8000/ask", {
//         question: question,
//       });

//       setChat([...chat, { question, answer: response.data.answer }]);
//       setAudioUrl(`http://127.0.0.1:8000/${response.data.audio_url}`);

//       // Play audio response
//       if (audioRef.current) {
//         audioRef.current.src = audioUrl;
//         audioRef.current.play().catch((error) => {
//           console.error("Error playing audio:", error);
//         });
//       }
//     } catch (error) {
//       console.error("There was an error processing your request!", error);
//     }
//     setQuestion(""); // Clear input field
//   };

//   // Handle document upload
//   const handleFileUpload = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       await axios.post("http://localhost:8000/upload", formData, {
//         headers: {
//           accept: "application/json",
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       alert("File uploaded successfully");
//     } catch (error) {
//       alert("Error uploading file");
//       console.error(error);
//     }
//   };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl text-center font-bold mb-6">AI Chatbot</h1>

//       {/* Chat interface */}
//       <div
//         className="chat-box bg-gray-200 p-4 rounded-lg mb-6"
//         style={{ height: "400px", overflowY: "auto" }}
//       >
//         {chat.map((message, index) => (
//           <div key={index} className="mb-4">
//             <p
//               className="text-gray-800 mb-2"
//               style={{ fontSize: `${fontSize}px` }}
//             >
//               <strong>Q:</strong> {message.question}
//             </p>
//             <p
//               className="text-blue-800 inline-block rounded"
//               style={{ fontSize: `${fontSize}px` }}
//             >
//               <strong>A:</strong> {message.answer}
//             </p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input section */}
//       <div className="input-section mb-6">
//         <textarea
//           value={question}
//           onChange={handleInputChange}
//           placeholder="Ask a question..."
//           className="w-full p-4 border rounded-lg mb-4"
//           rows="4"
//         ></textarea>
//         <button
//           onClick={sendQuestion}
//           className="w-full bg-blue-600 text-white p-2 rounded-lg"
//         >
//           Ask
//         </button>
//       </div>

//       {/* Font size slider */}
//       <div className="slider-section mb-6">
//         <label className="block text-gray-700 mb-2">
//           Font Size: {fontSize}px
//         </label>
//         <input
//           type="range"
//           min="10"
//           max="30"
//           value={fontSize}
//           onChange={handleFontSizeChange}
//           className="w-full"
//         />
//       </div>

//       {/* Audio playback */}
//       {audioUrl && (
//         <div className="audio-section mb-6">
//           <h3 className="text-lg font-bold mb-2">Listen to the Answer</h3>
//           <audio
//             ref={audioRef}
//             controls
//             src={audioUrl}
//             className="w-full"
//           ></audio>
//         </div>
//       )}

//       {/* File upload section */}
//       <form onSubmit={handleFileUpload} className="upload-section">
//         <label className="block text-gray-700 mb-2">
//           Upload a document (PDF or text):
//         </label>
//         <input
//           type="file"
//           onChange={handleFileChange}
//           className="w-full mb-4"
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white p-2 rounded-lg"
//         >
//           Upload Document
//         </button>
//       </form>
//       {/* <aduio ref={audioRef} className="hidden" /> */}
//     </div>
//   );
// }

// export default App;

import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState("");
  const [fontSize, setFontSize] = useState(16); // Initial font size
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Handle font size change with slider
  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  // Handle user input
  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  // Send question to Flask backend
  const sendQuestion = async () => {
    if (question.trim() === "") return;

    try {
      const response = await axios.post("http://localhost:8000/ask", {
        question: question,
      });

      setChat([
        ...chat,
        {
          question,
          answer: response.data.answer,
          audioUrl: `http://127.0.0.1:8000/${response.data.audio_url}`,
        },
      ]);
    } catch (error) {
      console.error("There was an error processing your request!", error);
    }
    setQuestion(""); // Clear input field
  };

  // Handle document upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully");
    } catch (error) {
      alert("Error uploading file");
      console.error(error);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Function to play audio
  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center font-bold mb-6">AI Chatbot</h1>

      {/* Chat interface */}
      <div
        className="chat-box bg-gray-200 p-4 rounded-lg mb-6"
        style={{ height: "400px", overflowY: "auto" }}
      >
        {chat.map((message, index) => (
          <div key={index} className="mb-4">
            <p
              className="text-gray-800 mb-2"
              style={{ fontSize: `${fontSize}px` }}
            >
              <strong>Q:</strong> {message.question}
            </p>
            <div className="flex items-center">
              <p
                className="text-blue-800 rounded mr-2"
                style={{ fontSize: `${fontSize}px` }}
              >
                <strong>A:</strong> {message.answer}
              </p>
              {message.audioUrl && (
                <button
                  onClick={() => playAudio(message.audioUrl)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Play Audio
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section */}
      <div className="input-section mb-6">
        <textarea
          value={question}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="w-full p-4 border rounded-lg mb-4"
          rows="4"
        ></textarea>
        <button
          onClick={sendQuestion}
          className="w-full bg-blue-600 text-white p-2 rounded-lg"
        >
          Ask
        </button>
      </div>

      {/* Font size slider */}
      <div className="slider-section mb-6">
        <label className="block text-gray-700 mb-2">
          Font Size: {fontSize}px
        </label>
        <input
          type="range"
          min="10"
          max="30"
          value={fontSize}
          onChange={handleFontSizeChange}
          className="w-full"
        />
      </div>

      {/* File upload section */}
      <form onSubmit={handleFileUpload} className="upload-section">
        <label className="block text-gray-700 mb-2">
          Upload a document (PDF or text):
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-4"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded-lg"
        >
          Upload Document
        </button>
      </form>
    </div>
  );
}

export default App;
