import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ConfirmEmail from "./pages/auth/ConfirmEmail";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/profile/ProfilePage";
import HotelsPage from "./pages/hotels/HotelsPage";

import NavbarPC from "./components/navbar_pc/NavbarPC";
import NavbarMobile from "./components/navbar_mobile/NavbarMobile";
import { useEffect, useState } from "react";
import OneHotelPage from "./pages/hotels/OneHotelPage";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      {isMobile ? <NavbarMobile /> : <NavbarPC />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<HotelsPage />} />
        <Route path="/hotels/:id" element={<OneHotelPage />} /> 

      </Routes>
    </Router>
  );
}

export default App;
