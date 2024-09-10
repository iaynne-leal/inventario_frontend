import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './ui/components/Login';
import Dashboard from './ui/components/Dashboard';
import Navbar from './ui/components/Navbar';





function App() {
  

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/dashboard' element={
        <>
        <Navbar/>
        <Dashboard/>
        </>
        }/>
       <Route path='/crear-usuario' element={
        <>
        <Navbar/>
        
        </>
        }/> 

    </Routes>
  </Router>
  );
}

export default App;
