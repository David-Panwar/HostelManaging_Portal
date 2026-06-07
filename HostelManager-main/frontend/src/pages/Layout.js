import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navabr from '../components/Navabr'
import WardenNavbar from '../components/WardenNavbar'

function Layout() {
  const location = useLocation()
  const isWardenPath = location.pathname.startsWith('/warden')
  const isWarden = JSON.parse(localStorage.getItem("role")) === 'warden'
  const showWardenNavbar = isWardenPath || isWarden

  return (
    <>
      {showWardenNavbar ? <WardenNavbar/> : <Navabr/>}
      <Outlet/>
    
    </>
  )
}

export default Layout
