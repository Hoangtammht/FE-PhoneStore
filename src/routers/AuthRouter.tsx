import {  Route, Routes } from 'react-router-dom';
import HomeScreen from '../screens/user/HomeScreen';
import Login from '../screens/admin/Login';
import ProductDetail from '../screens/user/ProductDetail';
import LayoutHome from '../screens/user/Layout';
import ProductByCategory from '../screens/user/ProductbyCategory';


const AuthRouter = () => {
    return (
      <Routes>
        <Route path="/" element={<LayoutHome><HomeScreen /></LayoutHome>} />
        <Route path="/admin" element={<Login />} />
        <Route path="/product/:productId" element={<LayoutHome><ProductDetail /></LayoutHome>} />
        <Route path="/product/category/:categoryID" element={<LayoutHome><ProductByCategory /></LayoutHome>} />
      </Routes>
    );
  };
  

export default AuthRouter