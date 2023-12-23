import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
import Login from './views/Login'
import Home from './views/Home'
import { useUser } from './context/UserProvider'
import { useEffect, useState } from 'react'
import ProtectedRoute from './views/ProtectedRoutes'
import LoginProtectedRoute from './views/LoginProtectedRoutes'
import DarkIcon from './icons/dark-icon.svg'

function App() {
  const { user, logout } = useUser()
  const [darkMode, setDarkMode] = useState(false)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    const isDarkMode =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    console.log(isDarkMode, 'isDarkMode')

    if (!isDarkMode) {
      document.querySelector('html')?.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.querySelector('html')?.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }
  useEffect(() => {
    toggleDarkMode()
  }, [])
  return (
    <div className='App dark:bg-gray-800 min-h-screen dark:text-white'>
      <header className='sticky top-0'>
        <nav className='bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800'>
          <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
            <Link
              to={'/'}
              className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'
            >
              SocialMedia
            </Link>
            <div className='flex items-center lg:order-2'>
              <Link
                to={user ? '/' : '/login'}
                className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
              ></Link>
              {user === null ? (
                <div>
                  <Link
                    to='/login'
                    className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div>
                  <Link
                    to={'/'}
                    className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
                  >
                    Home
                  </Link>
                  <button
                    className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      <Routes>
        <Route
          path='/login'
          element={
            <LoginProtectedRoute user={user}>
              <Login />
            </LoginProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <LoginProtectedRoute user={user}>
              <Login />
            </LoginProtectedRoute>
          }
        />
        <Route
          path='/'
          element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
      <button
        type='button'
        className='fixed bottom-0 right-0 z-50 flex items-center justify-center w-12 h-12 mr-4 mb-4 rounded-full dark:bg-white bg-gray-800 shadow-md focus:outline-none'
        aria-label='Dark mode'
        onClick={() => toggleDarkMode()}
      >
        <img
          src={DarkIcon}
          alt=''
        />
      </button>
    </div>
  )
}

export default App
