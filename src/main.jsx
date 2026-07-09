import { render } from 'preact'
import { ToastContainer } from 'react-toastify'

import './index.css'

import { App } from './app.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "bootstrap-icons/font/bootstrap-icons.css";

import 'react-toastify/dist/ReactToastify.css'

import './styles/theme.css'
import './styles/components.css'

render(

    <>

        <App />

        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
        />

    </>,

    document.getElementById('app')

)