import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
import Login from './views/Login'
import Home from './views/Home'
import { useUser } from './context/UserProvider'
import { useEffect } from 'react'

function App() {
  const { user, logout } = useUser()
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])
  return (
    <div className='App dark:bg-gray-800 min-h-screen dark:text-white'>
      <header className='sticky top-0'>
        <nav className='bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800'>
          <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
            <a
              href='https://flowbite.com'
              className='flex items-center'
            >
              <img
                src='https://flowbite.com/docs/images/logo.svg'
                className='mr-3 h-6 sm:h-9'
                alt='Flowbite Logo'
              />
              <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
                Flowbite
              </span>
            </a>
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
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
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
    </div>
  )
}

export default App
