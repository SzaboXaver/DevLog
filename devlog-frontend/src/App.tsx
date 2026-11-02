import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'

import { LoginPage } from './pages/login/LoginPage'
import { RegisterPage } from './pages/register/RegisterPage'
import { HomePage } from './pages/home/HomePage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { CreateProject } from './pages/createProject/CreateProject'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='home' element={<HomePage />} />
        <Route path='/home/settings' element={<SettingsPage />} />
        <Route path='/home/addProject' element={<CreateProject />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
