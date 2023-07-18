import React, { useState } from "react";
import axios from "axios";

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    axios
      .post("http://localhost:4000/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      })
      .then((response) => {
        // Handle success if needed
        console.log(response.data);
      })
      .catch((error) => {
        // Handle error if needed
        console.error(error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadProgress > 0 && <div>Upload Progress: {uploadProgress}%</div>}
    </div>
  );
};

export default VideoUpload;
