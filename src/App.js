import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navs from './Components/Navs';
import BlogAdd from './Pages/BlogAdd';
import { routes } from './routes';
import ContextProvider from './Context/AuthContext';
import BlogEdit from './Pages/BlogEdit';
import BlogContextProvider from './Context/BlogContext';
import ProtectRoute from './Components/ProtectRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ContextProvider>
      <BlogContextProvider>
        <ToastContainer />
        <BrowserRouter>
          <Navs />
          <Routes>
            {routes.map(r => (
              <Route key={r.name} path={r.path} element={r.element} />
            ))}
            <Route path="/blog_add" element={<ProtectRoute> <BlogAdd /> </ProtectRoute>} />
            <Route path="/blog_edit/:id" element={<ProtectRoute> <BlogEdit /> </ProtectRoute>} />
          </Routes>
        </BrowserRouter>
      </BlogContextProvider>
    </ContextProvider>
  );
}

export default App;
