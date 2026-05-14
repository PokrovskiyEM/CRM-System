import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { setupApiInterceptors } from './app/api/setup-api'
import { App } from './app/App'
import { store } from './app/store/store'
import './index.css'

setupApiInterceptors()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter >
    </Provider>
  </StrictMode >
)
