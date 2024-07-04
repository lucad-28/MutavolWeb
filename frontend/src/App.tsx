import { useRef, useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import Upload from "./Upload";

function App() {
  const [code, setCode] = useState<string>("// some comment");
  const [result, setResult] = useState<string>("");
  const medit = useRef(null);

  const handleChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleMedit = (editor: any) => {
    medit.current = editor;
    //@ts-ignore
    setCode(medit.current.getValue());
  };

  const handleVerify = async () => {
    setResult("");
    const response = await fetch("http://localhost:5050/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    });
    const res = await response.json();
    const { data, sucess } = res;
    if (sucess) {
      setResult(data.stdout);
    } else {
      const cout = data.stdout as string;
      const error = data.stderr as string;
      const serror = error.substring(
        error.indexOf("what():  ") + 9,
        error.length - 1
      );
      setResult(cout + "\n" +serror);
    }
  };

  const handleResponse = (res: any) => {
    const { sucess, data } = res;
    if (sucess) {
      setResult(data.stdout);
    } else {
      const cout = data.stdout as string;
      const error = data.stderr as string;
      const serror = error.substring(
        error.indexOf("what():  ") + 9,
        error.length - 1
      );
      setResult(cout + "\n" +serror);
    }
    setCode(data.content);
  };

  return (
    <div className="dark bg-gray-900 min-w-min h-full p-2">
      <div
        className="h-full grid grid-cols-3 my-1 justify-center"
        style={{ height: "10vh" }}
      >
        <h1 className="my-auto pl-2 text-xl font-extrabold leading-none tracking-tight text-white md:text-3xl lg:text-4xl">
          Proyecto final
        </h1>
        <h1 className="text-3xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          <span className="text-blue-600 dark:text-blue-500">LyC</span>
        </h1>
        <h1 className="my-auto pr-2 text-right text-xl font-extrabold leading-none tracking-tight text-white md:text-3xl lg:text-4xl">
          Grupo 03
        </h1>
      </div>
      <div className="dark grid grid-cols-6 gap-4">
        <div className="col-span-3">
          <div className="h-14 flex bg-zinc-800 rounded-se-2xl rounded-ss-2xl">
            <h2 className="my-auto ml-4 font-mono pl-2 text-lg font-extrabold leading-none tracking-tight text-white md:text-lg lg:text-xl">
              {`>`} Codigo Fuente...
            </h2>
            <div className="flex ml-auto mr-2 my-auto w-min h-6">
              <div className="rounded-full mx-2 w-6 h-6 bg-white"></div>
              <div className="rounded-full mx-2 w-6 h-6 bg-white"></div>
              <div className="rounded-full mx-2 w-6 h-6 bg-white"></div>
            </div>
          </div>
          <div
            className="h-3 bg-gray-700"
            style={{ background: "rgb(30,30,30)" }}
          ></div>
          <Editor
            height="75.8vh"
            theme="vs-dark"
            defaultLanguage="cpp"
            value={code}
            loading={<Loading />}
            onChange={handleChange}
            onMount={handleMedit}
            options={{
              contextmenu: false,
            }}
          />
        </div>

        <div className="my-auto min-w-min flex flex-col justify-center">
          <Upload onResponse={handleResponse} />
          <button
            type="button"
            className="text-white mt-4 min-w-24 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm py-2.5 text-center"
            onClick={handleVerify}
          >
            Verify
          </button>
        </div>

        <div className="col-span-2">
          <div className="h-14 flex bg-zinc-800 rounded-se-2xl rounded-ss-2xl">
            <h2 className="my-auto ml-4 font-mono pl-2 text-lg font-extrabold leading-none tracking-tight text-white md:text-lg lg:text-xl">
              {`>`} Resultado
            </h2>
            <div className="flex ml-auto mr-2 my-auto w-min h-6"></div>
          </div>
          <div
            className="h-3 bg-gray-700"
            style={{ background: "rgb(30,30,30)" }}
          ></div>
          <div className="pl-3" style={{ background: "rgb(30,30,30)" }}>
            <Editor
              height="75.8vh"
              theme="vs-dark"
              value={result}
              loading={<Loading />}
              options={{
                selectionHighlight: false,
                occurrencesHighlight: "off",
                renderLineHighlight: "none",
                fontSize: 19,
                minimap: { enabled: false },
                lineNumbers: "off",
                folding: false,
                codeLens: false,
                readOnly: true,
                contextmenu: false,
                lineDecorationsWidth: 0,
                glyphMargin: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

const Loading = () => {
  return (
    <div
      style={{ height: "75.8vh", width: "full", background: "rgb(30,30,30)" }}
    ></div>
  );
};
