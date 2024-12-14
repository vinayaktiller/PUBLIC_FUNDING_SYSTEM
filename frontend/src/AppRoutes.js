import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";

import Homepage from './Pages/Authenticated/Homepage'
import Profilepage from './Pages/Authenticated/Profilepage';
import Connectionpage from './Pages/Authenticated/Connectionpage';
import Childrenpage from './Pages/Authenticated/Childrenpage';
import Loginpage from './Pages/Unauthenticated/Loginpage';
import ProtectedRoute from './User/ProtectedRoute';
import Mainbar from './Layout/Mainbar';
import Waitingpage from './Pages/Unauthenticated/Waitingpage';
import Registration from './Pages/Unauthenticated/Registration';



const clientId = '719395873709-ese7vg45i9gfndador7q6rmq3untnkcr.apps.googleusercontent.com'

const AppRoutes = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Loginpage />} />
          <Route path="/waiting" element={<Waitingpage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<ProtectedRoute />}> 
            <Route path="/" element={<Mainbar />}> 
              <Route path="home" element={<Homepage />} /> 
              <Route path="profile" element={<Profilepage />} /> 
              <Route path="connections" element={<Connectionpage />} /> 
              <Route path="children" element={<Childrenpage />} /> {/* Add more routes here as needed */} 
            </Route> 
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default AppRoutes;




