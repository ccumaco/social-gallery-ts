import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({
  redirectPath = '/login',
  user,
  children,
}: {
  redirectPath?: string
  children?: any
  user?: any
}) => {
  if (!user) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    )
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute
