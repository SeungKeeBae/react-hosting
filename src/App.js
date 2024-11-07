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
  
  const sendToken = useCallback((url, jsonData) => {
    jsonData.preventDefault();
    postRequest(jsonData, handleError, handleCallback);
});

const postRequest = async (json, OnError, callback) => {
  // 비밀번호 추가
  const password = '1004';  // 비밀번호를 UGSettingObjectWrapper.ScriptPassword에 맞게 설정하세요.
  const jsonObject = JSON.parse(json);
  jsonObject.password = password;
  const updatedJson = JSON.stringify(jsonObject);

  const baseURL = 'https://script.google.com/macros/s/AKfycbyLKnYr9aV3NmQmdusHvdMTZ3y1m7mYMext9Ke1ofx44JdMVpt4eW7PdTr2nQiaEuQR/exec';  // 실제 URL로 바꿔주세요.

  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: updatedJson,  // json 데이터를 본문에 포함시킴
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // JSON 응답 처리
    const responseData = await response.json();

    // 콜백 함수 호출
    callback(responseData);
  } catch (error) {
    // 오류 처리
    OnError(error);
  }
};

  // 요청을 보낼 때 호출될 콜백 함수
  const handleCallback = ((responseData) => {
    console.log(responseData);
    sendMessage("UnityPlayerWebRequest", "RecieveUnity", responseData)
  }, [sendMessage]);

  // 오류를 처리할 함수
  const handleError = ((error) => {
    console.log(error.message);
    sendMessage("UnityPlayerWebRequest", "RecieveUnity", data)
  }, [sendMessage]);

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