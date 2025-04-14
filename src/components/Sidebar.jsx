import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdWork, 
  MdEmail, 
  MdSettings, 
  MdBusinessCenter, 
  MdLogout,
  MdPeople,
  MdBusiness
} from 'react-icons/md';
import { BsStar, BsPerson } from 'react-icons/bs';
import { HiDocumentText } from 'react-icons/hi';

const Sidebar = ({ userType }) => {
  const location = useLocation();

  const adminLinks = [
    { path: '/admin-dashboard', name: 'Dashboard', icon: <MdDashboard className="text-xl" /> },
    { path: '/manage-users', name: 'Manage Users', icon: <MdPeople className="text-xl" /> },
    { path: '/manage-companies', name: 'Manage Companies', icon: <MdBusiness className="text-xl" /> },
    { path: '/manage-jobs', name: 'Manage Jobs', icon: <MdWork className="text-xl" /> },
    { path: '/logout', name: 'Logout', icon: <MdLogout className="text-xl" /> }
  ];

  const employerLinks = [
    { path: '/employer-dashboard', name: 'Dashboard', icon: <MdDashboard className="text-xl" /> },
    { path: '/applications', name: 'Applications', icon: <MdEmail className="text-xl" /> },
    { path: '/company-profile', name: 'Company Profile', icon: <MdBusinessCenter className="text-xl" /> },
    { path: '/logout', name: 'Logout', icon: <MdLogout className="text-xl" /> }
  ];

  const jobseekerLinks = [
    { path: '/jobseeker-dashboard', name: 'Jobs', icon: <MdDashboard className="text-xl" /> },
    { path: '/saved-jobs', name: 'Saved Jobs', icon: <BsStar className="text-xl" /> },
    { path: '/my-applications', name: 'My Applications', icon: <MdEmail className="text-xl" /> },
    { path: '/profile', name: 'My Profile', icon: <BsPerson className="text-xl" /> },
    { path: '/logout', name: 'Logout', icon: <MdLogout className="text-xl" /> }
  ];


  const links = 
    userType === 'admin' ? adminLinks :
    userType === 'employer' ? employerLinks :
    jobseekerLinks;

  return (
    <div className="bg-white w-64 min-h-screen shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold text-[#4682B4] mb-4">
          {userType === 'admin' ? 'Job Jungle' :
           userType === 'employer' ? 'Job jungle' :
           'Job Jungle'}
        </h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                location.pathname === link.path
                  ? 'bg-[#4682B4] text-white'
                  : 'text-gray-600 hover:bg-[#4682B4]/10'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;