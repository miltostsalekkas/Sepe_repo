import { mount } from 'svelte';
import { inject } from '@vercel/analytics';
import './app.css';
import App from './App.svelte';

// Vercel Web Analytics: cookieless page views. Only reports from the
// deployed site; in development it logs to the console instead.
inject({ mode: import.meta.env.PROD ? 'production' : 'development' });

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;
