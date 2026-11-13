// JARVIS AI 2.0 - small server-side proxy. Keep OPENAI_API_KEY on the server only.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-6-astra';
const ROOT = __dirname;
const SYSTEM = `You are JARVIS, a helpful, calm, respectful personal assistant. Reply in the same language as the user, preferably natural Hindi when the user writes Hindi. Be concise, honest about limitations, and never claim you performed actions you cannot perform. You cannot control the user's phone, apps, files, or accounts unless a connected and authorized tool explicitly allows it. Do not ask for passwords, API keys, OTPs, or sensitive personal information.`;
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    return fs.createReadStream(path.join(ROOT,'index.html')).pipe(res);
  }
  if (req.method === 'POST' && req.url === '/api/chat') {
    if (!API_KEY) { res.writeHead(503, {'Content-Type':'application/json; charset=utf-8'}); return res.end(JSON.stringify({error:'सर्वर पर AI key सेट नहीं है। इसे वेबसाइट में नहीं, सुरक्षित server setting में जोड़ना होगा।'})); }
    let raw='';
    req.on('data', chunk => { raw += chunk; if (raw.length > 20000) req.destroy(); });
    req.on('end', async () => {
      try {
        const body=JSON.parse(raw || '{}');
        const message=String(body.message || '').trim().slice(0,4000);
        if (!message) throw new Error('खाली संदेश भेजा गया।');
        const recent=Array.isArray(body.history) ? body.history.slice(-10) : [];
        const transcript=recent.map(x => ({role:x.role==='assistant'?'assistant':'user',content:String(x.content||'').slice(0,4000)}));
        if (!transcript.length || transcript[transcript.length-1].content !== message) transcript.push({role:'user',content:message});
        const response=await fetch('https://api.openai.com/v1/responses',{
          method:'POST', headers:{'Authorization':`Bearer ${API_KEY}`,'Content-Type':'application/json'},
          body:JSON.stringify({model:MODEL,instructions:SYSTEM,input:transcript})
        });
        const data=await response.json();
        if (!response.ok) throw new Error(data.error?.message || `AI सेवा ने ${response.status} त्रुटि दी।`);
        const reply=String(data.output_text || '').trim();
        if (!reply) throw new Error('AI से खाली जवाब मिला।');
        res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
        res.end(JSON.stringify({reply}));
      } catch (err) {
        res.writeHead(400, {'Content-Type':'application/json; charset=utf-8'});
        res.end(JSON.stringify({error:err.message || 'अनुरोध पूरा नहीं हुआ।'}));
      }
    });
    return;
  }
  res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('Not found');
});
server.listen(PORT, () => console.log(`JARVIS AI server listening on ${PORT}`));
