import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext'

const ProtectRoute = ({children}) => {
  const { state } = useContext(AuthContext);
  return state.user ? children : <Navigate to="/signin" />
}

export default ProtectRoute