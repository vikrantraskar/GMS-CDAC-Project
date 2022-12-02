import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
// get the store and provider
import { Provider } from 'react-redux'
import { store, persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { showCommonSpinner } from './utils/common-helper';
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={showCommonSpinner(true)} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  //    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
