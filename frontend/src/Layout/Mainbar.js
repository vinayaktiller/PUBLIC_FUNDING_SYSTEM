import React from 'react'
import Headbar from './Headbar'
import Navigationbar from './Navigationbar'
import Notificationbar from './Notificationbar'
import { Outlet } from 'react-router-dom'
import './Mainbar.css'
import { useNavAndNotification } from './useNavAndNotification'

function Mainbar() {
    const { state, toggleNav, toggleNotifications } = useNavAndNotification();
  return (
    <div className="main-container">
    <Headbar
     toggleNav={toggleNav}
     toggleNotifications={toggleNotifications}
     state={state}
     />
    <div className='container'>
        {state.isNavVisible ? <Navigationbar /> : null}
        
        {state.isNotificationsVisible ? <Notificationbar /> : null}
        
        <main className='center'> 
            <Outlet /> {/* This is where page-specific content will go */}
        </main>
    </div>
    
    
    
  </div>
  )
}

export default Mainbar