
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Employer from './components/Employer';
import JobSeeker from './components/Jobseeker';
import Path from './components/Path';
import Auth from './components/Auth';
import Landing from './components/Landing';

function App() {
  return (
    <Router>
      <Auth>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/employer-dashboard"
            element={
              <Path requiredRole="employer">
                <Employer/>
              </Path>
            }
          />
          <Route
            path="/jobseeker-dashboard"
            element={
              <Path requiredRole="jobseeker">
                <JobSeeker/>
              </Path>
            }
          />
        </Routes>
      </Auth>
    </Router>
  );
}

export default App;