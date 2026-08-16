import { KDS } from './pages/KDS';
import { KitchenDashboard } from './pages/KitchenDashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CustomerOrder } from './pages/CustomerOrder';
import { AdminProducts } from './pages/AdminProducts';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/" element={<KDS />} />
          <Route path="/dashboard" element={<KitchenDashboard />} />
          <Route path="/order" element={<CustomerOrder/>} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;