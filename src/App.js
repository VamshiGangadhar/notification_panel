import "./App.css";
import AddNotificationForm from "./components/AddNotificationForm";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ViewNotifications from "./components/ViewNotifications";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/add-notification" element={<AddNotificationForm />} />
          <Route path="/view-notifications" element={<ViewNotifications />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
