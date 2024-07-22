import "./App.css";
import Full_Search from "./Components/Full_Search";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Account_Dash from "./Pages/Account_Dash";
import Compare from "./Pages/Compare";
import About from "./Pages/About";

function App() {
  return (
    <Router>
      <div key={"4"} className="App">
        <Routes>
          <Route key={"1"} path="/Dashboard" element={<Account_Dash />} />
          <Route key={"2"} path="/Compare" element={<Compare />} />
          <Route key={"3"} path="/About" element={<About />} />
          <Route key={"4"} path="/" element={<Full_Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
