import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './../User/userSlice';

function Navigationbar() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className='navbar'>
      <p>Navigationbar</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navigationbar;
