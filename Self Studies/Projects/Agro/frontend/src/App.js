import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import Dashboard from './pages/dashboardPage';
import CustomersList from './pages/customersList';
import LoyaltyTable from './pages/loyaltyTable';
import ChangePassword from './pages/changePassword';
import LoyaltyApplication from './pages/loyaltyApplication';
import UpdateCustomer from './pages/updateCustomer';
import LoyaltyPage from './pages/loyaltyPage';
import ErrorPage from './pages/erroPage'; 
import CustomerProfile from './pages/profile/customerProfile';
import UpdateCustomerProfile from './pages/profile/updateCustomerProfile';
import UserProfile from './pages/profile/userProfile';
import UpdateMyProfile from './pages/profile/updateMyProfile';
import ReportGenerate from './pages/reportGenerate';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect from root */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomersList />} />
        <Route path="/loyaltyTable" element={<LoyaltyTable />} />
        <Route path="/change" element={<ChangePassword />} />
        <Route path="/loyalty/:customerId" element={<LoyaltyPage />} />
        <Route path="/loyalty/apply/:customerId" element={<LoyaltyApplication />} />
        <Route path="/update" element={<UpdateCustomer />} />
        <Route path="/customer/view/:customerId" element={<CustomerProfile />} />
        <Route path="/customer/edit/:customerId" element={<UpdateCustomerProfile />} />
        <Route path="/myprofile/:customerId" element={<UserProfile />} />
        <Route path="/customer/myedit/:customerId" element={<UpdateMyProfile />} />
        <Route path="/ReportGenerate" element={<ReportGenerate />} />
        
        {/* 404 Route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
