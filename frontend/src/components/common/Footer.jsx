import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JobPortal</h3>
            <p className="text-gray-400">
              Connecting talented professionals with great opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
              <li><a href="/companies" className="text-gray-400 hover:text-white">Companies</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Email: info@jobportal.com</p>
            <p className="text-gray-400">Phone: (555) 123-4567</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
