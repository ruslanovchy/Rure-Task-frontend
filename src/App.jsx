import { createContext, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom'
import './App.css'
import Login from './pages/login/Login.jsx'
import Signup from './pages/signup/Signup.jsx'
import { Toaster } from 'react-hot-toast'
import ProjectsList from './pages/ProjectsList/ProjectsList.jsx'
import Projects from './pages/Projects/Projects.jsx'
import Project from './pages/Project/Project.jsx'
import AuthProvider, { AuthContext } from './auth/auth.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import IndexPage from './pages/IndexPage/IndexPage.jsx'

export const ThemeContext = createContext();
export const LoadingContext = createContext();

export let globalNavigate = null;

function AppContent() {
  const [theme, setTheme] = useState('light')
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const loadingContext = useContext(LoadingContext);
  const navigate = useNavigate();
  globalNavigate = navigate;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme])

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className='header'>
        <Link className='logo' to='/'>Rure Task</Link>

        <div className='right'>
          {authContext.user ?
            <button onClick={() => { authContext.logout(); navigate('/login'); }}>Выйти</button> : 
            <button onClick={() => navigate('/login')}>Войти</button>}
          
        </div>
        
      </div>
      <div className='main-container'>

        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        <ThemeContext.Provider value={{ theme, setTheme }}>

          <Routes>
            <Route path='/' element={<IndexPage />} />
            <Route path='/projects' element={<Projects />}>
              <Route index element={<ProjectsList />} />
              <Route path=':id' element={<Project />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>

          <LoadingScreen isLoading={isLoading}></LoadingScreen>

        </ThemeContext.Provider>
        </LoadingContext.Provider>

      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent></AppContent>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App