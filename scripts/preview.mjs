import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export function createPreviewServer(directory = 'dist') {
  const root=resolve(directory)
  const types={ '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.svg':'image/svg+xml' }
  return createServer(async(req,res)=>{
    res.setHeader('X-Robots-Tag','noindex, follow')
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405,{ Allow:'GET, HEAD' });res.end();return }
    try {
      const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
      let file=resolve(root,'.'+path),status=200
      if (file!==root && !file.startsWith(root+sep)) { res.writeHead(403);res.end();return }
      let info=await stat(file).catch(()=>null)
      if (info?.isDirectory()) {
        if (!path.endsWith('/')) { res.writeHead(301,{ Location:path+'/'+new URL(req.url,'http://localhost').search });res.end();return }
        file=resolve(file,'index.html');info=await stat(file).catch(()=>null)
      }
      if (!info?.isFile()) { status=404;file=resolve(root,'404.html');info=await stat(file).catch(()=>null) }
      if (!info?.isFile()) { res.writeHead(404);res.end('Ejecuta npm run build antes de abrir la vista previa.');return }
      res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream')
      res.setHeader('Cache-Control','no-cache')
      res.setHeader('Accept-Ranges','bytes')
      let start=0,end=info.size-1
      if (req.headers.range && status===200) {
        const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range)
        if (!match || (!match[1] && !match[2])) { res.writeHead(416,{ 'Content-Range':`bytes */${info.size}` });res.end();return }
        start=match[1] ? Number(match[1]) : Math.max(0,info.size-Number(match[2]))
        end=match[1] && match[2] ? Math.min(Number(match[2]),info.size-1) : info.size-1
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start>end || start>=info.size) { res.writeHead(416,{ 'Content-Range':`bytes */${info.size}` });res.end();return }
        status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${info.size}`)
      }
      res.writeHead(status,{ 'Content-Length':Math.max(0,end-start+1) })
      if (req.method==='HEAD' || !info.size) { res.end();return }
      const stream=createReadStream(file,{ start,end });stream.on('error',()=>res.destroy());stream.pipe(res)
    } catch { if (!res.headersSent) res.writeHead(400);res.end() }
  })
}
if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const index=process.argv.indexOf('--port')
  const port=Number(index>=0 ? process.argv[index+1] : 4174)
  createPreviewServer().listen(port,'127.0.0.1',()=>console.log(`Pruebas SEO: http://127.0.0.1:${port}/ (noindex)`))
}
