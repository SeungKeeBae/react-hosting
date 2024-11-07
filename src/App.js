import React, { useEffect, useCallback } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider,
    sendMessage, // unity 함수를 호출하기 위한 sendMessage 추가
    addEventListener, // unity -> react 통신
    removeEventListener, // unity -> react 통신
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
   } = useUnityContext({
    loaderUrl: "build/react-hosting.loader.js",
    dataUrl: "build/react-hosting.data",
    frameworkUrl: "build/react-hosting.framework.js",
    codeUrl: "build/react-hosting.wasm",
  });
  const sendToken = useCallback((url, jsonData) => {
    fetch(url, {
      method : "POST",          //메소드 지정
      headers : {               //데이터 타입 지정
          "Content-Type":"application/json; charset=utf-8"
      },
      body: JSON.stringify(jsonData)   //실제 데이터 파싱하여 body에 저장
        }).then(res=>res.json())        // 리턴값이 있으면 리턴값에 맞는 req 지정
          .then(res=> {
            console.log(res);
            sendMessage('Trigger', 'RecieveUnity', res);        // 리턴값에 대한 처리
    });
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