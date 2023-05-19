import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SecretPanel from "./pages/Secret";
import Signin from "./pages/Signin";
import "./App.css";
import ProtectedRoute from "./common/protected-router";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/secret" element={<SecretPanel />} />
          </Route>
          <Route path="/" element={<Signin />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
