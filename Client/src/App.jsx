import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";  // <-- import Toaster here
import './App.css';
import ZenithSignup from "./Pages/Signup";
import ZenithLogin from "./Pages/ZenithLogin";
import { useEffect } from "react";
import HomePage from './Pages/Homepage'
import { useStore } from "../store/Store";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./Pages/Dashboard";

function App() {
  const user = useStore((state)=>state.User)
  const setUser = useStore((state)=>state.setUser)
  
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: 'green',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        
        {/* <Navbar/> */}
        <Routes>

          <Route path="/" element={<HomePage/>}/>
          <Route path="/signup" element={<ZenithSignup />} />
          <Route path="/login" element={<ZenithLogin/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
