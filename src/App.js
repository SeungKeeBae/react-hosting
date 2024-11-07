import React, { useCallback, useEffect, useState } from "react";
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

  const RequsetPost = useCallback((url, jsonData) => {
    Answer(jsonData);
  }, []);

  useEffect(() => {
    addEventListener("RequsetPost", RequsetPost);

    return () => {
      detachAndUnloadImmediate().catch((reason) => {
        console.log(reason);
      });
      removeEventListener("RequsetPost", RequsetPost);
    };
  }, [
    detachAndUnloadImmediate,
    addEventListener,
    removeEventListener,
    setSpeedUp,
    setSpeedDown,
  ]);

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