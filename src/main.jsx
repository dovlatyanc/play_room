import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import storeConfig from './store/store.js'
import './i18n.js';

createRoot(document.getElementById('root')).render(
 
    <Provider store={storeConfig}>
      <App />
    </Provider>
)
