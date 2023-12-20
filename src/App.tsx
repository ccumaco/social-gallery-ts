import './App.css'
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './views/Login'
import Home from './views/Home'
import { UserProvider } from './context/UserProvider'
// Create a context for user data
function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <header className='App-header'>
          <Link to='/login'>Login</Link>
          <Link to='/register'>register</Link>
          <Link to='/'>Home</Link>
        </header>

        {/* Provide the user data to all components */}
        <UserProvider>
          <Routes>
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/register'
              element={<Login />}
            />
            <Route
              path='/'
              element={<Home />}
            />
          </Routes>
        </UserProvider>
      </div>
    </BrowserRouter>
  )
}

export default App
