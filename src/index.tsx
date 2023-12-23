import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { UserProvider } from './context/UserProvider'
import { PostProvider } from './context/PostProvider'
import { CommentProvider } from './context/CommentProvider'
import { BrowserRouter } from 'react-router-dom'
import DarkIcon from './icons/dark-icon.svg'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PostProvider>
          <CommentProvider>
            <App />
          </CommentProvider>
        </PostProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
