import React, { useEffect, useCallback } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider,
    sendMessage, // unity 함수를 호출하기 위한 sendMessage 추가
    addEventListener, // unity -> react 통신
    removeEventListener, // unity -> react 통신
   } = useUnityContext({
    loaderUrl: "build/react-hosting.loader.js",
    dataUrl: "build/react-hosting.data",
    frameworkUrl: "build/react-hosting.framework.js",
    codeUrl: "build/react-hosting.wasm",
  });
  
  const sendToken = useCallback((jsonData) => {
    console.log("sendToken : ok");
    console.log("jsonData : " + jsonData);

    postRequest(jsonData, handleError, handleCallback);
});

const postRequest = async (json, OnError, callback) => {
  const password = '1004';  // 비밀번호를 UGSettingObjectWrapper.ScriptPassword에 맞게 설정하세요.
  if (!json) {
    OnError(new Error("!json : Invalid JSON input"));
    return;
  }

  let jsonObject;
  try {
    console.log(json)
    jsonObject = JSON.parse(json);
  } catch (error) {
    OnError(new Error("JSON.parse(json); : Invalid JSON format"));
    return;
  }
  const baseURL = 'https://script.google.com/macros/s/AKfycbyLKnYr9aV3NmQmdusHvdMTZ3y1m7mYMext9Ke1ofx44JdMVpt4eW7PdTr2nQiaEuQR/exec';
  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      redirect: "follow",
      headers: {
        'Content-Type': 'application/json',
      },
      body: json,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    try {
      const responseData = JSON.parse(responseText);  // 응답을 JSON으로 변환
      callback(responseData);
    } catch (error) {
      throw new Error("Response is not valid JSON");
    }
  } catch (error) {
    console.error("Error during POST request:", error);
    OnError(error);
  }
};

  // 요청을 보낼 때 호출될 콜백 함수
  const handleCallback = (data) => {
    console.log("data : " + data);
    sendMessage("UnityPlayerWebRequest", "RecieveUnity", data)
  }
  // 오류를 처리할 함수
  const handleError = (error) => {
    console.log("error.message : " + error.message)
    sendMessage("UnityPlayerWebRequest", "RecieveUnity", error)
  }

useEffect(() => {
    if (unityProvider) {
        addEventListener('reactRequsetPost', sendToken);
        return () => {
            removeEventListener('reactRequsetPost', sendToken);
        };
    }
}, [unityProvider, sendToken, addEventListener, removeEventListener]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React / Unity Test</h1>
        <Unity
          unityProvider={unityProvider}
          style={{ width: "1440px", height: "2560px" }}
        />
      </header>
    </div>
  );
}

export default App;