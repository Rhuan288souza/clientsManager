import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserManagement from './components/userManagement/Users'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <div style={{marginLeft: "50px"}}>
      <Routes>
        <Route path="/" element={<UserManagement />} />
      </Routes>
      </div>
    </Router>
  )
}

export default App
