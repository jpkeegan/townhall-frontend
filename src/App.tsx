import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RegistrationPage } from './components/pages/registration-page';
import { SignInPage } from './components/pages/sign-in-page';
import { HomePage } from './components/pages/home-page';
import { User } from './components/requests/user-requests';
import { ComplaintDetailsPage } from './components/pages/complaint-details-page';
import { MeetingDetailsPage } from './components/pages/meeting-details-page';
import { AddMeetingPage } from './components/pages/add-meeting-page';
import { NavBar } from './components/pages/nav-bar';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const queryClient = new QueryClient();

  const handleUserLogin = (loggedInUser: User) => {
    setLoggedInUser(loggedInUser);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('user');
    setLoggedInUser(null);
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {loggedInUser && <NavBar user={loggedInUser} onUserLogout={handleUserLogout} />}
          <div>
            <Routes>
              <Route path="/" element={loggedInUser ? (
                    <HomePage user={loggedInUser} onUserLogout={handleUserLogout} />
                  ) : (
                    <SignInPage onUserLogin={handleUserLogin} />
                    )}/>
              <Route path="/registration" element={<RegistrationPage />} />
              {loggedInUser?.role === 'Sith Lord' && (
                <Route path="/complaint/:complaint_id" element={<ComplaintDetailsPage user={loggedInUser} />} />
              )}
              {loggedInUser?.role != null && (
                <Route path="meeting/:meeting_id" element={<MeetingDetailsPage user={loggedInUser} />} />
              )}
              <Route path="/add-meeting" element={loggedInUser?.role === 'Sith Lord' ? (
                    <AddMeetingPage user={loggedInUser} />
                  ) : (
                    <Navigate to="/" />
                  )}/>
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;



