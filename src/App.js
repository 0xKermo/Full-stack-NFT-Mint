import './App.css';
import {Navbar,Footer} from './components'
import {Home} from './pages'
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <div>
      <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
      <Footer />
    </div>
  );
}

export default App;
