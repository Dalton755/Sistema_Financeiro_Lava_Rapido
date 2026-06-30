import { render } from 'preact'
import './index.css'
import { App } from './app.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/theme.css'
import './styles/components.css'

render(<App />, document.getElementById('app'))
