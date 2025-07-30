import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Questions from './pages/Questions';
import AskQuestion from './pages/AskQuestion';
import Answer from './pages/Answer'; // ✅ Ensure this is imported
import Profile from './pages/Profile'
import Layout from "./components/Layout";
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/askquestion" element={<AskQuestion />} />
            <Route path="/questions/:id" element={<Answer />} /> {/* ✅ This handles answer page */}
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/create" element={<CreateBlog />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
