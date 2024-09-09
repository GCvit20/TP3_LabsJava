import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GuessForm from './Home/components/GuessForm/GuessForm'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<GuessForm />}></Route>
        </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App
