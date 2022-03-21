import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';

import 'modern-normalize/modern-normalize.css'; // css reset
import '@cds/core/global.css'; // pre-minified version breaks
import '@cds/core/styles/theme.dark.css'; // pre-minified version breaks
import '@cds/city/css/bundles/default.min.css'; // load base font
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
