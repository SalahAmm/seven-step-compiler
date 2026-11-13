import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/noto-sans-arabic'
import '@fontsource-variable/noto-naskh-arabic'
import 'katex/dist/katex.min.css'
import './styles/global.css'
import './styles/pages.css'
import './styles/guide.css'
import './styles/arabic.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
