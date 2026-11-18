import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import LoginPage from './pages/Login/LoginPage'
import RegistrationPage from './pages/Registration/Registration'
import HomePage from './pages/Home/HomePage'
import CreateProjectPage from './pages/CreateProject/CreateProject'
import ProjectPage from './pages/ProjectPage/ProjectPage'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='registration' element={<RegistrationPage />} />
          <Route path='home' element={<HomePage />} />
          <Route path='/home/createProject' element={<CreateProjectPage />} />
          <Route path='/home/projectPage' element={<ProjectPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
