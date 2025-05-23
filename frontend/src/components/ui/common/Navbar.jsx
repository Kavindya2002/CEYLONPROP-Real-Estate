import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Home, Slack, MessageSquare } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navItemVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  const getDashboardLink = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "seller":
        return "/seller/dashboard";
      case "customer":
        return "/customer/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="bg-black shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-4">
  <motion.div
    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
    transition={{ duration: 0.5 }}
    className="text-villain-500"
  >
    <img src="/logo.png" alt="Logo" className="w-16 h-16" />
  </motion.div>
  <div className="flex flex-col items-center">
    <span className="text-lg font-bold text-violet-50">CEYLONPROP</span>
    <span className="text-sm font-medium text-violet-50">Real Estate</span>
  </div>
</Link>





          <nav className="flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <motion.div
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="relative"
                >
                  <Link
                    to={getDashboardLink()}
                    className={`font-medium ${
                      location.pathname.includes("dashboard") || location.pathname.includes("admin")
                        ? "text-villain-500"
                        : "text-gray-600 hover:text-villain-500"
                    }`}
                  >
                    <Slack className="h-5 w-5 inline-block mr-1" />
                    
                  </Link>
                </motion.div>
                
                <motion.div
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="relative"
                >
                  <Link
                    to="/chat"
                    className={`font-medium ${
                      location.pathname.startsWith("/chat")
                        ? "text-villain-500"
                        : "text-gray-600 hover:text-villain-500"
                    }`}
                  >
                    <MessageSquare className="h-5 w-5 inline-block mr-1" />
                    
                  </Link>
                  {location.pathname.startsWith("/chat") && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-villain-500"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </motion.div>
              </>
            )}
            
            <motion.div
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative"
            >
              
              {location.pathname.startsWith("/seller") && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-villain-500"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </motion.div>
            
            {isAuthenticated && user?.role === "admin" && (
              <motion.div
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Link
                  to="/admin/dashboard"
                  className={`font-medium ${
                    location.pathname.startsWith("/admin")
                      ? "text-black"
                      : "text-violet-100 hover:text-villain-500"
                  }`}
                >
                  Admin Portal
                </Link>
                {location.pathname.startsWith("/admin") && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-villain-500"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </motion.div>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name || "Account"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="font-normal text-sm text-gray-500">Signed in as</div>
                    <div className="font-medium">{user?.email}</div>
                    <div className="text-xs text-gray-400 mt-1 capitalize">Role: {user?.role}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/chat" className="w-full">
                      Chat Assistant
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "seller" && (
                    <DropdownMenuItem asChild>
                      <Link to="/seller/profile" className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => logout()}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
             <Link to="/about">
  <Button 
    variant="outline" 
    size="sm" 
    className="flex items-center px-4 py-2 border-black text-violet-50 hover:bg-villain-400 rounded-md bg-black"
  >
    About Us
  </Button>
</Link>


                 <Link to="/chat">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="lex items-center px-4 py-2 border-black text-violet-50 hover:bg-villain-400 rounded-md bg-black"
                  >
                   
                    Support
                  </Button>
                </Link>
                
                <Link to="/customer/register">
                  <Button size="sm" className="lex items-center px-4 py-2 border-black text-violet-50 hover:bg-villain-400 rounded-md bg-black">
                    Sign Up
                  </Button>
                </Link>
               
               <Link to="/login">
  <Button
    variant="outline"
    size="sm"
    className="flex items-center px-4 py-2 border-black text-violet-50 hover:bg-villain-400 rounded-md bg-black"
  >
    <User className="h-4 w-4 mr-1" />
  </Button>
</Link>

              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;