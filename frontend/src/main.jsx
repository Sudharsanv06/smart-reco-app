import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles/global.css"
import "./styles/auth.css"
import "./styles/navbar.css"
import "./styles/dashboard.css"
import "./styles/resource-card.css"
import "./styles/admin.css"
import "./styles/profile.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)