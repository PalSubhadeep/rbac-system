import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global styles reset
const style = document.createElement("style");
style.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f4f8; }
  a { color: #3b82f6; }
  button:hover { opacity: 0.9; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
