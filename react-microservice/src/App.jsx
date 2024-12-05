import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pos from "./pages/Pos";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/MainLayout";
import RootLayout from "./components/RootLayout";
import LoginLayout from "./components/LoginLayout";
import HomePage from "./pages/HomePage";
import Order from "./pages/Order";
import Product from "./pages/product";
import OrderItem from "./pages/OrderItem";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";

function App() {

  window.location.pathname.includes("/dashboard");

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>

          <Route path="/" element={<RootLayout />}>
            <Route path="" element={<HomePage />} />
          </Route>

          <Route path="/dashboard" element={<MainLayout />}>
            <Route path="" element={<Dashboard/>} />
            <Route path="pos" element={<Pos/>} />
            <Route path="order" element={<Order/>} />
            <Route path="product" element={<Product/>} />
            <Route path="profile" element={<Profile/>} />
            <Route path="order-item" element={<OrderItem/>} />
            <Route path="*" element={<h1>404-Route Not Found!</h1>} />
          </Route>

          <Route path="/dashboard" element={<LoginLayout />}>
            <Route path="login" element={<LoginPage />} />
          </Route>
        
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


