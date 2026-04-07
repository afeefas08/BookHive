import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { useState } from 'react'
import Home from './Pages/Home'
import Register from './Pages/Register'
import Login from './Pages/Login'
import ForgotPassword from './Pages/ForgotPassword'
import ProtectedRoute from './compontents/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />

        <Route path='/cart' element={
          <ProtectedRoute>
            {/* cart */}
          </ProtectedRoute>
      }></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
