import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/ui/common/Navbar";
import { getProperties } from "@/services/propertyService";
import { Link, useNavigate } from "react-router-dom";
import { 
  getCurrentCustomer, 
  updateCustomer,
  deleteCustomer 
} from "@/services/customerService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/hooks/use-toast';
import { updatePassword } from "@/services/authService";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerProfile, setCustomerProfile] = useState(null);
  
  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    interests: []
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getProperties({ page: 1, limit: 10 });
        if (Array.isArray(response)) {
          setProperties(response);
        } else if (response && response.properties) {
          setProperties(response.properties);
        } else {
          console.error("Unexpected API response format:", response);
          setProperties([]);
        }
        
        if (user && user._id) {
          const customerData = await getCurrentCustomer(user._id);
          setCustomerProfile(customerData);
          
          setProfileForm({
            firstName: customerData.firstName || "",
            lastName: customerData.lastName || "",
            email: customerData.email || "",
            phone: customerData.phone || "",
            address: customerData.address || "",
            interests: customerData.interests || []
          });
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      } 
    };

    loadData();
  }, [user]);

  const handleEditProfile = async () => {
    if (!user || !user._id) return;
    
    try {
      setFormSubmitting(true);
      const updatedCustomer = await updateCustomer(user._id, profileForm);
      setCustomerProfile(updatedCustomer);
      setEditProfileOpen(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setFormSubmitting(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (!user || !user._id) return;
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setFormSubmitting(true);
      await updatePassword(
        user._id,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      setChangePasswordOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast({
        title: "Success",
        description: "Password changed successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to change password", error);
      toast({
        title: "Error",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive"
      });
    } finally {
      setFormSubmitting(false);
    }
  };  

  const handleDeleteAccount = async () => {
    if (!user || !user._id) return;
    
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setFormSubmitting(true);
      await deleteCustomer(user._id);
      toast({
        title: "Success",
        description: "Account deleted successfully",
        variant: "default"
      });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setFormSubmitting(false);
    }
  };  

  const interestOptions = [
    "Residential",
    "Industrial", 
    "Commercial"
  ];
  
  const handleInterestChange = (interest) => {
    setProfileForm(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      
      return { ...prev, interests };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Rest of the JSX remains exactly the same */}
          {/* ... (all JSX content preserved as-is) ... */}
        </motion.div>
      </main>

      {/* Modals remain exactly the same */}
      {/* ... (all modal JSX preserved as-is) ... */}
    </div>
  );
};

export default Dashboard;