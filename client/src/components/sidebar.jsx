import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Sidebar = ({ openRequestFormDialog, openProfileEditFormDialog, a, b }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition duration-300"
        >
          {isCollapsed ? (
            <FiMenu className="w-4 h-4" />
          ) : (
            <FiX className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 pt-10 left-0 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 
          ${isCollapsed ? "-translate-x-full" : "translate-x-0"} w-64 md:w-64`}
      >
        <nav className="mt-8 px-4">
          <ul className="space-y-4">
            <li>
              <Button
                onClick={() => { navigate('/hospitalProfile') }}
                className="text-blue-600 hover:underline normal-case p-0"
              >
                Profile
              </Button>
            </li>
            {a && <li>
              <Button
                onClick={openProfileEditFormDialog}
                className="text-blue-600 hover:underline normal-case p-0"
              >
                Edit Profile
              </Button>
            </li>}
            <li>
              <Button
                onClick={() => { navigate('/bloodRequests') }}
                className="text-blue-600 hover:underline normal-case p-0"
              >
                Requests
              </Button>
            </li>
            {b && <li>
              <Button
                onClick={openRequestFormDialog}
                className="text-blue-600 hover:underline normal-case p-0"
              >
                Add request
              </Button>
            </li>}
            <li>
              <Button
                onClick={() => { navigate('/donors') }}
                className="text-blue-600 hover:underline normal-case p-0"
              >
                Donors
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Background Overlay when Sidebar is Open */}
      {!isCollapsed && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
