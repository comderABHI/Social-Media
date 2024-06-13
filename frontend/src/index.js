import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from 'react-redux';
import store from './store';
import {ToastContainer} from 'react-toastify'
import {Toaster} from 'react-hot-toast'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <Provider store={store}>
  <App />
  <Toaster/>
  </Provider>
   
  </React.StrictMode>,
  document.getElementById('root')
);


