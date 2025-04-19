import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Import the store from redux/store
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}> 
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  </StrictMode>
);
