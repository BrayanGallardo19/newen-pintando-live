import { renderToString } from 'react-dom/server'
import App from './App'
import { products,site } from './content'
import { productPath,resolveRoute,sectionPaths } from './features/navigation'
import { headMarkup } from './features/metadata'
export const routes=[...Object.values(sectionPaths),...products.map(productPath)]
export const canonicalRoutes=['/',...products.map(productPath)]
export function render(path:string) {
 const route=resolveRoute(path,products)
 return {html:renderToString(<App initialUrl={path} />),head:headMarkup(route,site)}
}
