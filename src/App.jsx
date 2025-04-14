import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Employer from "./components/Employer";
import JobSeeker from "./components/Jobseeker";
import Path from "./components/Path";
import Auth from "./components/Auth";
import Landing from "./components/Landing";
import Applications from "./components/Applications";
import CompanyProfile from "./components/CompanyProfile";
import Logout from "./components/Logout";
import SavedJobs from "./components/SavedJobs";
import MyApplications from "./components/MyApplications";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import ManageUsers from './components/ManageUsers';
import ManageCompanies from "./components/ManageCompanies";
import ManageJobs from "./components/ManageJobs";

function App() {
  return (
    <Router>
      <Auth>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/applications"
            element={
              <Path requiredRole="employer">
                <Applications />
              </Path>
            }
          />

          <Route
            path="/company-profile"
            element={
              <Path requiredRole="employer">
                <CompanyProfile />
              </Path>
            }
          />
          <Route
            path="/logout"
            element={
              <Path requiredRole="employer">
                <Logout />
              </Path>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <Path requiredRole="jobseeker">
                <SavedJobs />
              </Path>
            }
          />
          <Route
            path="/my-applications"
            element={
              <Path requiredRole="jobseeker">
                <MyApplications />
              </Path>
            }
          />
          <Route
            path="/profile"
            element={
              <Path requiredRole="jobseeker">
                <Profile />
              </Path>
            }
          />
          <Route
            path="/employer-dashboard"
            element={
              <Path requiredRole="employer">
                <Employer />
              </Path>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <Path requiredRole="admin">
                <Admin />
              </Path>
            }
          />
           <Route
            path="/manage-users"
            element={
              <Path requiredRole="admin">
                <ManageUsers />
              </Path>
            }
          />
           <Route
    path="/manage-companies"
    element={
      <Path requiredRole="admin">
        <ManageCompanies />
      </Path>
    }
  />
   <Route
    path="/manage-jobs"
    element={
      <Path requiredRole="admin">
        <ManageJobs />
      </Path>
    }
  />
          <Route
            path="/jobseeker-dashboard"
            element={
              <Path requiredRole="jobseeker">
                <JobSeeker />
              </Path>
            }
          />
        </Routes>
      </Auth>
    </Router>
  );
}

export default App;
