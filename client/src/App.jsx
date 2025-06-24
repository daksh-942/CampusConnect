import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Questions from './pages/Questions';
import AskQuestion from './pages/AskQuestion';



function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/askquestion" element={<AskQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
