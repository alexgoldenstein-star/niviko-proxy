const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ML_API = 'https://api.mercadolibre.com';
const ML_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token';

// ── Health check ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'NIVIKO ML Proxy', version: '1.0.0' });
});

// ── Intercambiar code por token ───────────────────────────
app.post('/auth/token', async (req, res) => {
  try {
    const { client_id, client_secret, code, redirect_uri } = req.body;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id,
      client_secret,
      code,
      redirect_uri
    });
    const resp = await fetch(ML_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: body.toString()
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Renovar token con refresh_token ──────────────────────
app.post('/auth/refresh', async (req, res) => {
  try {
    const { client_id, client_secret, refresh_token } = req.body;
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id,
      client_secret,
      refresh_token
    });
    const resp = await fetch(ML_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: body.toString()
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Datos del usuario autenticado ────────────────────────
app.get('/me', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const resp = await fetch(`${ML_API}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Órdenes de un vendedor con filtros de fecha ──────────
app.get('/orders', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const { seller_id, from, to, offset = 0, limit = 50 } = req.query;

    const params = new URLSearchParams({
      seller: seller_id,
      'order.date_created.from': from,
      'order.date_created.to': to,
      'order.status': 'paid',
      offset,
      limit,
      sort: 'date_desc'
    });

    const resp = await fetch(`${ML_API}/orders/search?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Todas las órdenes del período (paginado automático) ──
app.get('/orders/all', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const { seller_id, from, to } = req.query;
    let allOrders = [];
    let offset = 0;
    const limit = 50;
    let total = null;

    while (total === null || offset < total) {
      const params = new URLSearchParams({
        seller: seller_id,
        'order.date_created.from': from,
        'order.date_created.to': to,
        'order.status': 'paid',
        offset,
        limit,
        sort: 'date_desc'
      });

      const resp = await fetch(`${ML_API}/orders/search?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await resp.json();

      if (!data.results) break;
      allOrders = allOrders.concat(data.results);
      total = data.paging?.total || 0;
      offset += limit;

      if (allOrders.length >= total) break;
      if (offset > 1000) break; // seguridad: max 1000 órdenes por llamada
    }

    res.json({ orders: allOrders, total: allOrders.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Detalle de una orden ─────────────────────────────────
app.get('/orders/:id', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const resp = await fetch(`${ML_API}/orders/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Detalle de envío ─────────────────────────────────────
app.get('/shipments/:id', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const resp = await fetch(`${ML_API}/shipments/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Publicaciones del vendedor ───────────────────────────
app.get('/items', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const { seller_id, sku } = req.query;
    let url = `${ML_API}/users/${seller_id}/items/search?limit=100`;
    if (sku) url += `&seller_sku=${sku}`;
    const resp = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Billing / comisiones de una orden ────────────────────
app.get('/orders/:id/billing', async (req, res) => {
  try {
    const token = req.headers['x-ml-token'];
    const resp = await fetch(`${ML_API}/orders/${req.params.id}/billing_info`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NIVIKO Proxy corriendo en puerto ${PORT}`));

module.exports = app;
