import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/react-hosting.loader.js",
    dataUrl: "build/react-hosting.data",
    frameworkUrl: "build/react-hosting.framework.js",
    codeUrl: "build/react-hosting.wasm",
  });

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