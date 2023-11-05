import React, { useState, useEffect, useRef } from 'react';
// import { useSpeechSynthesis } from 'react-speech-kit';
import axios from 'axios';

function Main() {
  const [videoStream, setVideoStream] = useState(null);
  const [capture ,setcapture] = useState(true);
  const [viewButton, setViewButton] = useState(false);
  // const {speak} = useSpeechSynthesis();
  const videoRef = useRef();
  const serverUrl = 'http://127.0.0.1:5000'; 
  // let bool = false;
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    initCamera();
  }, []);


  const captureFrame = async () => {
    if (videoRef.current && videoStream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const frameBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));

      sendFrameToServer(frameBlob);
    }
  };
    // const continousCapture = () => {
  //   console.log("event11",bool)
  //   if (bool) {
  //     console.log("event1111",bool)
  //     captureFrame();
  //     setTimeout(continousCapture, 5000); 
  //   }
  //   
  // }

  // useEffect(()=>{
  //   const interval = setInterval(()=>{
  //     if(capture){
  //       captureFrame()
  //     }
  //   },4000);
  //   return () => clearInterval(interval);
  // },[])

  let intervalId = null;

  const continousCapture = () => {
    console.log("event11",capture)
    clearInterval(intervalId); 
    intervalId = setInterval(() => {
      captureFrame();
    }, 5000);
  }


  const handleStart = () => {
    setViewButton(true);
    setcapture(true);
    //   console.log("event11",capture)
    continousCapture();
  }

  const handleStop = () => {
    setViewButton(false);
    setcapture(false);
    clearInterval(intervalId); 
    //   console.log("event11",bool)
    window.location.reload(false);
  }

  const fetchTextData = async () => {
    try {
      // const response = await fetch(`${serverUrl}/get_text`);
    
      // if (response.ok) {
      //   const textData = await response.json();
      //   console.log(textData)
      //   return textData;
      // } else {
      //   console.error('Failed to fetch text data:', response.statusText);
      //   return [];
      // }
      axios.get(`${serverUrl}/get_text`).then(
        (res)=>{console.log(res)}
      ).catch((err)=>{console.log(err)})
      
    } catch (error) {
      console.error('Error fetching text data:', error);
      return [];
    }
  };

  const sendFrameToServer = async (frameBlob) => {
    console.log(frameBlob)
    try {
      const response = await fetch(`${serverUrl}/predict_emotion`, {
        method: 'POST',
        body: frameBlob,
        headers:{
          'Content-Type': 'image/jpeg',
          'Content-Disposition': 'attachment; filename="image.jpg"',
        }
       
      });
      // axios.post()
      console.log(response.data);
      if (!response) {
        console.error('Failed to send frame to the server:', response.statusText);
      } else {

        const textData = await fetchTextData();
        if (textData.length > 0) {


          // const description = textData.join(', '); 
          // console.log("description",description)
          //   speak({text:description, lang: 'en'})
          // print(textData)
          console.log(textData)

        }
      }
    } catch (error) {
      console.error('Error sending frame to the server:', error);
    }
  };

 



  return (
    <div className="App">
      <h1>Camera App</h1>
      <video ref={videoRef} autoPlay />
      {viewButton ?  <button onClick={handleStop}>Stop Frame</button> :<button onClick={handleStart}>Capture Frame</button> }
    </div>
  );
}

export default Main;
