 
import { useState, useRef, useEffect } from "react";

import "./App.css";

export function App() {
  const [huffOutput, setHuffOutput] = useState("");
  const [yulInput, setYulInput] = useState("");
   
  const textareaRef = useRef(null);

  const opcodes = [
    "mul",
    "div",
    "add",
    "sub",
    "mod",
    "lt",
    "gt",
    "eq",
    "and",
    "or",
    "shr",
    "shl",
    "iszero",
    "byte",
    "mload",
    "mstore",
    "sload",
    "sstore"
  ];

  useEffect(() => {
    // Update the height of the textarea based on its content
    const textarea = (textareaRef.current as unknown) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [huffOutput]);

  function isOperator(c:string) {
    return (
      !(c >= "a" && c <= "z") &&
      !(c >= "0" && c <= "9") &&
      !(c >= "A" && c <= "Z")
    );
  }
  
  const processYulExpression = () => {
    let yulExpression = yulInput;
    yulExpression = yulExpression.replace(/\s/g, "");
    yulExpression = yulExpression.replace(/([\(\),])/g, " $1 ");
    let yulExpressionArray = yulExpression.split(/\s+/);
    let yulExpressionArrayCleaned = [];
    for (let c = 0; c < yulExpressionArray.length; c++) {
      if (opcodes.indexOf(yulExpressionArray[c]) > -1) {
        yulExpressionArrayCleaned.push(yulExpressionArray[c] + " ");
      }
      if (
        !isOperator(yulExpressionArray[c]) &&
        opcodes.indexOf(yulExpressionArray[c]) == -1
      ) {
        if (isNaN(Number(yulExpressionArray[c]))) {
          yulExpressionArrayCleaned.push(yulExpressionArray[c]);
        } else {
          yulExpressionArrayCleaned.push(
            "0x" + parseInt(yulExpressionArray[c]).toString(16) + " "
          );
        }
      }
    }
    yulExpressionArrayCleaned.reverse();
    let result="";
    for (let c in yulExpressionArrayCleaned) {
       result += yulExpressionArrayCleaned[c] + "\n";
    }
     setHuffOutput(result);

  };

  return (
    <>
      <header>
        <div className="header">
          <div className="header-left">
          </div>
          <div className="header-center">
            <h1>YulToHuff</h1>
            <h5>beta</h5>
          </div>
          <div className="header-right">{/* <ConnectKitButton /> */}</div>
        </div>
      </header>
      <div className="main">
        <h2>Yul Expression</h2>
          <textarea
            className="textarea-terminal"
            value={yulInput}
            placeholder="Try 'add(1,2)'"
            onChange={(e) => setYulInput(e.target.value)}
          />
          <p className="note">Note: Only valid YUL arithmetic expressions are supported and not all opcodes are supported yet.</p>
        <button className="button-execute on" onClick={processYulExpression}>
          Convert ►
        </button>
       
        <div style={{ marginBottom: "20px" }} />
 
        <h2>Huff Output</h2>
        <textarea 
          className="textarea-terminal"
          value={huffOutput}
          placeholder="Output"
          rows={5}
          readOnly
          ref={textareaRef}
          style={{ height: "auto", overflowY: "hidden" }} 
          onChange={(e) => setHuffOutput(e.target.value)}
         />
       
      </div>

      <footer>
      <p className="note"> The code for the interface was taken from the vEVM (https://vevm-demo.vercel.app) project ❤️ </p>
        <a href="https://www.evm.codes/?fork=merge" target={"_blank"}>
          <img height="25" src="logo-evmcodes-light.png" alt="evm codes"></img>
        </a>
        <a
          href="https://ethereum.github.io/execution-specs/autoapi/ethereum/paris/vm/index.html"
          target={"_blank"}
        >
          <img
            height="25"
            src="logo-specification-light.png"
            alt="Ethereum Specification"
          ></img>
        </a>
        <a
          href="https://docs.huff.sh"
          target={"_blank"}
        >
          <img height="30" src="huff-logo.png" alt="Huff"></img>
        </a>
      </footer>
    </>
  );
}
