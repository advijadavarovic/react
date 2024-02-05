import React, {lazy, Suspense} from "react";
import LinearProgress from '@mui/material/LinearProgress';
import {useAuthContext} from "./context/AuthContext";
import {BrowserRouter, Routes, Route} from 'react-router-dom';

const LazyRootLayout = lazy(() => import( './pages/Root'));
const LazySignUp = lazy(() => import( './pages/SignUp'));
const LazyLogin = lazy(() => import( './pages/Login'));
const LazyDashboardPage = lazy(() => import( './pages/MainDashboard'));
const LazyProfilePage = lazy(() => import('./pages/Profile'));
function App() {
  const user = useAuthContext();

  return (
        <Suspense fallback={<LinearProgress color="secondary" />}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LazyRootLayout />} />
              <Route path="signup" element={<LazySignUp />} />
              <Route path="login" element={<LazyLogin />} />
              <Route
                  path="dashboard"
                  element={user ? <LazyDashboardPage /> : <LazyLogin />}
              />
              <Route
                  path="profile"
                  element={user ? <LazyProfilePage /> : <LazyLogin/> }
              />
              <Route path="*" element={user ? <LazyDashboardPage /> : <LazyRootLayout/> } />
            </Routes>
          </BrowserRouter>
        </Suspense>
  );
}
export default App;
