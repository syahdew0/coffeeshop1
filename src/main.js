import './public-path';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import { API_ENDPOINTS } from './config/api';
import './assets/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

async function initSiteInfo() {
  const cached = localStorage.getItem('siteInfo');
  if (cached) {
    try {
      const cachedData = JSON.parse(cached);
      document.title = cachedData.site_title || 'Property Template';
      return cachedData;
    } catch (error) {
      console.warn('Failed to parse cached siteInfo', error);
    }
  }
  
  try {
    const resInfo = await axios.get(API_ENDPOINTS.siteInfo());
    const websiteId = resInfo?.data?.id || resInfo?.data?.website_id;
    const resSettings = await axios.get(API_ENDPOINTS.siteSettingsPublic(websiteId));
    const siteData = resSettings?.data?.settings || resSettings?.data?.data || {};
    
    document.title = siteData.site_title || 'Property Template';
    localStorage.setItem('siteInfo', JSON.stringify(siteData));
    return siteData;
  } catch (error) {
    console.error('Failed to load site info', error);
    return {};
  }
}

async function bootstrapApp() {
  const siteData = await initSiteInfo();
  const app = createApp(App);
  app.provide('siteInfo', siteData);
  app.use(router);
  app.mount('#app');
}

bootstrapApp();
