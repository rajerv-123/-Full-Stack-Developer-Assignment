import React, { useState, useEffect, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu as MenuIcon, X, ChevronDown } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";


type MenuItemRenderProps = {
  active: boolean;
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(status);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="backdrop-blur-md bg-white/70 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/home"
          className="text-3xl font-extrabold text-blue-600 hover:text-blue-700 transition duration-300"
        >
          DevConnect
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn && (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50 transition">
                Menu <ChevronDown className="ml-2 w-4 h-4" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }: MenuItemRenderProps) => (
                        <Link
                          to="/dashboard"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }: MenuItemRenderProps) => (
                        <Link
                          to="/post-project"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Post Project
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }: MenuItemRenderProps) => (
                        <Link
                          to="/search"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Search Projects
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }: MenuItemRenderProps) => (
                        <Link
                          to="/home"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Home
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }: MenuItemRenderProps) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? "bg-red-100 text-red-700" : "text-red-600"
                          } block w-full text-left px-4 py-2 text-sm`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full border-2 border-blue-600 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 pb-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 font-medium text-lg hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                to="/post-project"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 font-medium text-lg hover:text-blue-600"
              >
                Post Project
              </Link>
              <Link
                to="/search"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 font-medium text-lg hover:text-blue-600"
              >
                Search Projects
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-red-600 font-medium text-lg hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-full border-2 border-blue-600 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:brightness-110 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
