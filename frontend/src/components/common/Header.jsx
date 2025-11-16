import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated, isCandidate, isEmployer, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            JobPortal
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600">
              Browse Jobs
            </Link>
            <Link to="/companies" className="text-gray-700 hover:text-blue-600">
              Companies
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                
                {isCandidate && (
                  <Link to="/my-applications" className="text-gray-700 hover:text-blue-600">
                    My Applications
                  </Link>
                )}
                
                {isEmployer && (
                  <>
                    <Link to="/my-jobs" className="text-gray-700 hover:text-blue-600">
                      My Jobs
                    </Link>
                    <Link to="/post-job" className="text-gray-700 hover:text-blue-600">
                      Post Job
                    </Link>
                  </>
                )}
                
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin Panel
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold text-gray-800">{user?.user?.email}</p>
                      <p className="text-xs text-gray-500">{user?.user?.role}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
