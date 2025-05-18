import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [user, setUser] = useState({
    name: "",
    role: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}`);
        console.log(response.data);
        setUser(response.data); // assuming response.data is { name: "", role: "" }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []); // empty dependency array so it runs once on mount

  return (
    <>
      <div>
        <h1>Hello {user.name}</h1>
        <p>Role: {user.role}</p>
      </div>
    </>
  );
}

export default App;
