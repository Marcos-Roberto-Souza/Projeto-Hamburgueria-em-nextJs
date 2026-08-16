import { KDS } from './pages/KDS';
import { KitchenDashboard } from './pages/KitchenDashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CustomerOrder } from './pages/CustomerOrder';
import { AdminProducts } from './pages/AdminProducts';
import { LoginPage } from './pages/LoginPage';
import { Cashier } from './pages/Cashier';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<HomePage/>} />
          <Route path="/customer-order" element={<LoginPage/>} />
          <Route path="/cashier" element={<Cashier/>}/>
          <Route path="/Kds" element={<KDS />} />
          <Route path="/dashboard" element={<KitchenDashboard />} />
          <Route path="/order" element={<CustomerOrder/>} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;