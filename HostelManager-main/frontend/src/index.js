import React from 'react';
import ReactDOM from 'react-dom/client';
import {createRoutesFromElements , createBrowserRouter, Route , RouterProvider} from 'react-router-dom'
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './pages/Layout';
import Register from './pages/Register' ;
import CreatePost from './pages/CreatePost';
import { Provider } from 'react-redux';
import store from './store/store';
import CreateRequest from './pages/CreateRequest';
import NotFound from './pages/NotFound';

import WardenLogin from './pages/WardenLogin';
import WardenRegister from './pages/WardenRegister';
import WardenCreatePost from './pages/WardenCreatePost';
import WardenDashboard from './pages/WardenDashboard';
import WardenPostStatus from './pages/WardenPostStatus';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/post' element={<CreatePost/>}/>
      <Route path=':id/request' element={<CreateRequest/>}/>
      
      {/* Warden Routes */}
      <Route path='/warden/login' element={<WardenLogin/>}/>
      <Route path='/warden/register' element={<WardenRegister/>}/>
      <Route path='/warden/post' element={<WardenCreatePost/>}/>
      <Route path='/warden/dashboard' element={<WardenDashboard/>}/>
      <Route path='/warden/post/:id/status' element={<WardenPostStatus/>}/>

      <Route path='/*' element={<NotFound/>}/>
    </Route>
  )
)



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
     </Provider>
      </React.StrictMode>
     
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
