import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./ui/components/Login";
import Dashboard from "./ui/components/Dashboard";
import Navbar from "./ui/components/Navbar";
import { useState } from "react";

function App() {
  // Aquí levantamos el estado de las agencias en el componente principal
  const [shouldUpdateAgencies, setShouldUpdateAgencies] = useState(false);

  // Función para activar la actualización de agencias
  const handleAgencyCreated = () => {
    setShouldUpdateAgencies(true);
  };

  // Función para resetear el estado una vez que se actualicen las agencias
  const handleAgenciesUpdated = () => {
    setShouldUpdateAgencies(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <>
              {/* Pasamos el handler para que el Navbar lo use */}
              <Navbar onAgencyCreated={handleAgencyCreated} />
              <Dashboard 
                shouldUpdateAgencies={shouldUpdateAgencies}
                onAgenciesUpdated={handleAgenciesUpdated}
              />
            </>
          }
        />
        <Route
          path="/crear-usuario"
          element={
            <>
              <Navbar />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
