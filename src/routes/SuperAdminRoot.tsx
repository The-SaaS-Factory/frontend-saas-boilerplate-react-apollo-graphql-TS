import React from 'react'
import { Outlet } from 'react-router-dom'

const SuperAdminRoot = () => {
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default SuperAdminRoot