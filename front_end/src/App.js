import './App.css';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import Layout from './screens/Layout';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter basename='/'>
      {/* <HashRouter> */}
        <Layout />
        <ToastContainer position='top-center' autoClose={1000} />
      </BrowserRouter>
      {/* </HashRouter> */}
    </div>
  );
}

export default App;
