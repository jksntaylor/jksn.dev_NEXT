import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { PrismicProvider } from '@prismicio/react'
import { client } from './utils/prismic.ts'
import ScreenProvider from './components/Providers.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrismicProvider client={client}>
      <ScreenProvider>
        <App />
      </ScreenProvider>
    </PrismicProvider>
  </React.StrictMode>,
)
