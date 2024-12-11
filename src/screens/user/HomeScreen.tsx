import { Routes, Route } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import ContentPage from './Content';
import ProductByCategory from './ProductbyCategory';

function HomeScreen() {
  return (
    <div>
      <Routes>
        <Route path="/homepage" element={<ContentPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/product/:category" element={<ProductByCategory />} />
      </Routes>
    </div>
  );
}


export default HomeScreen;
