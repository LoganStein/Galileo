import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './Pages/Home.tsx'
import AccountDashboard from './Pages/AccountDashboard.tsx'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/account" element={<AccountDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
