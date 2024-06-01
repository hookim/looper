import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './views/App';
import {Provider} from "react-redux";
import getReduxStore from './redux/redux-store';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Provider store = {getReduxStore()}><App/></Provider>);

