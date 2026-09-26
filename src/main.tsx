import { createRoot,hydrateRoot } from 'react-dom/client'
import App from './App'
const root=document.getElementById('root')!
const app=<App initialUrl={location.pathname+location.search+location.hash} />
if (root.querySelector('main')) hydrateRoot(root,app)
else createRoot(root).render(app)
