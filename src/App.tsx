import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import TripDetail from './pages/TripDetail'
import Trips from './pages/Trips'
import ProtectedRoute  from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="Register" element={<Register />}/>
      <Route path="TripDetail" element={<TripDetail />}/>
      <Route path="Trips" element={
        <ProtectedRoute>
          <Trips />
        </ProtectedRoute>
      }/>
    </Routes>
  )
}

export default App