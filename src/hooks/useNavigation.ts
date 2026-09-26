import { useEffect, useRef, useState } from 'react'
import { products } from '../content'
import { createNavigation, resolveRoute } from '../features/navigation'

export function useNavigation(initialUrl: string) {
  const [route,setRoute]=useState(()=>resolveRoute(initialUrl,products))
  const controller=useRef<ReturnType<typeof createNavigation> | null>(null)
  useEffect(()=>{
    const oldRestoration=history.scrollRestoration
    history.scrollRestoration='manual'
    let frame=0
    const nav=createNavigation({
      url:()=>location.pathname+location.search+location.hash,
      state:()=>history.state,scroll:()=>({x:scrollX,y:scrollY}),
      push:(state,url)=>history.pushState(state,'',url),replace:(state,url)=>history.replaceState(state,'',url),back:()=>history.back(),
      move:(section,position,smooth=false)=>{
        cancelAnimationFrame(frame)
        frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
          const target=document.getElementById(section)
          const header=document.querySelector('header')?.getBoundingClientRect().height ?? 0
          const top=position?.y ?? (section==='inicio' ? 0 : Math.max(0,(target?.getBoundingClientRect().top ?? 0)+scrollY-header-12))
          window.scrollTo({left:position?.x ?? 0,top,behavior:smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant'})
        })})
      },
    },products,setRoute,globalThis.crypto?.randomUUID?.() ?? `navigation-${Date.now()}-${Math.random()}`)
    controller.current=nav
    window.addEventListener('popstate',nav.sync)
    window.addEventListener('hashchange',nav.sync)
    nav.sync()
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('popstate',nav.sync);window.removeEventListener('hashchange',nav.sync);history.scrollRestoration=oldRestoration;controller.current=null}
  },[])
  return {route,navigate:(url:string)=>controller.current?.navigate(url),close:()=>controller.current?.close()}
}
