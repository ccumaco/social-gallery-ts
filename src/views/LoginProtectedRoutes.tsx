import { Navigate, Outlet } from 'react-router'

const LoginProtectedRoute = ({
  redirectPath = '/',
  user,
  children,
}: {
  redirectPath?: string
  children?: any
  user?: any
}) => {
  if (user) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    )
  }

  return children ? children : <Outlet />
}

export default LoginProtectedRoute
