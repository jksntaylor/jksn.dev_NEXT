import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { PrismicProvider } from '@prismicio/react'
import { client } from './utils/prismic.ts'
import { ScreenProvider, DebugProvider } from './components/Providers.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PrismicProvider client={client}>
    <ScreenProvider>
      <DebugProvider>
        <App />
      </DebugProvider>
    </ScreenProvider>
  </PrismicProvider>,
)
