// Contador de visitas del sitio. Solo atiende /api/visitas (ver run_worker_first en wrangler.jsonc);
// todo lo demás lo sirve Cloudflare directamente como archivos estáticos.
// Guarda únicamente el total: ni direcciones IP, ni cookies, ni datos del visitante.
import { DurableObject } from 'cloudflare:workers';

export class ContadorVisitas extends DurableObject {
  async leer() {
    return (await this.ctx.storage.get('total')) || 0;
  }
  // Un Durable Object atiende de a una operación de almacenamiento: dos visitas simultáneas no se pisan.
  async sumar() {
    const total = (await this.leer()) + 1;
    await this.ctx.storage.put('total', total);
    return total;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/visitas') return new Response('No encontrado', { status: 404 });

    const contador = env.CONTADOR.get(env.CONTADOR.idFromName('sitio'));
    let total;
    if (request.method === 'GET') {
      total = await contador.leer();
    } else if (request.method === 'POST') {
      // Solo suman las visitas enviadas desde el propio sitio
      if (request.headers.get('Origin') !== url.origin) return new Response('No permitido', { status: 403 });
      total = await contador.sumar();
    } else {
      return new Response('Método no permitido', { status: 405, headers: { Allow: 'GET, POST' } });
    }
    return Response.json({ total }, { headers: { 'Cache-Control': 'no-store' } });
  },
};
