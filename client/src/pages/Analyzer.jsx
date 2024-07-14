import React, { useState } from "react";
import "./Analyzer.css";
import Download from "../assets/download.png";
import "react-json-view-lite/dist/index.css";
import Header from "../components/Header/Header";
import Report from "../components/Report/Report";
import Chat from "../assets/chat.png";
import Delete from "../assets/Delete.png";
import { ReportData } from "../assets/data/ReportData";
import ChatBox from "../components/ChatBox/ChatBox";

const Analyzer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseResult, setResponseResult] = useState(null);
  const [paraData, setParaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      const response = await fetch("https://medihacks-1.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResponseResult(data);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPara = async () => {
    setLoading1(true);
    if (responseResult) {
      try {
        const response = await fetch(
          "https://medihacks-1.onrender.com/gemini",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: responseResult }),
          }
        );
        const result = await response.json();
        setParaData(result.final_response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setLoading1(false);
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="bodyContain">
          <div className="leftBody">
            <label htmlFor="uploadInput">
              <img
                className="uploadIcon"
                src={Download}
                alt="Upload Image"
                width="80"
                height="80"
              />
            </label>
            <input
              id="uploadInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <div className="tagline">Upload Your Urine Strip Image</div>
            {selectedImage && (
              <div className="selectedImageName">{selectedImage.name}</div>
            )}
            <button
              className="button-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <div className="loader"></div> : "Submit"}
            </button>
          </div>
          <div className="rightBody">
            <div className="imgContain">
              {selectedImage ? (
                <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
              ) : (
                <div className="selectImageText">Select Image for Report</div>
              )}
            </div>
          </div>
        </div>
        {responseResult && <Report responseResult={responseResult} />}

        {responseResult && !paraData && (
          <div className="suggestion">
            <button className="button-3" onClick={fetchPara} disabled={loading}>
              {loading1 ? (
                <div className="loader"></div>
              ) : (
                "Get Some Suggestion"
              )}
            </button>
          </div>
        )}
        {paraData && (
          <div className="leftBody leftBody-1">
            <div className="paraHeading">Precaution and Cure</div>
            {paraData.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
      </div>
      <div className="chatIcon" onClick={() => setChatOpen(!chatOpen)}>
        {!chatOpen ? (
          <img src={Chat} alt="chat" />
        ) : (
          <img src={Delete} alt="cross" />
        )}
      </div>
      {chatOpen && (
        <div className="chatBox">
          <ChatBox />
        </div>
      )}
    </>
  );
};

export default Analyzer;
