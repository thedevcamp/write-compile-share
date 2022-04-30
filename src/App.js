import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage';
import {Toaster} from 'react-hot-toast';

//import Test from './pages/Test';

function App() {
  return (
    <>
    <Toaster></Toaster>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/editor/:roomId" element={<EditorPage/>}></Route>

        {/* For Testting purposes Only */}
        {/* <Route path="/test" element={<Test/>}></Route> */}
      </Routes>
      
      
      </BrowserRouter>
      </>
  );
}

export default App;
