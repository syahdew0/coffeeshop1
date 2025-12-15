<template>
  <div id="app" class="min-h-screen flex flex-col">
    <NavbarApp :settings="siteInfo" :menuItems="menuItems" />
    <main class="flex-grow">
      <router-view />
    </main>
    <FooterPage :settings="siteInfo" />
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import axios from 'axios';
import API_ENDPOINTS from '@/config/api';
import NavbarApp from '@/components/NavbarApp.vue';
import FooterPage from '@/components/FooterPage.vue';

const siteInfo = inject('siteInfo', {});
const menuItems = ref([]);

const fetchMenu = async () => {
  try {
    const menuGroup = window.MENU_GROUP_SLUG || 'main';
    const response = await axios.get(API_ENDPOINTS.menuListByGroup(menuGroup));
    const items = response?.data?.data || response?.data || [];
    
    if (items.length > 0) {
      menuItems.value = items.map(item => ({
        id: item.id,
        title: item.title || item.label || item.name,
        path: item.path || item.url || item.link || '/',
        target: item.target || '_self',
        parent_id: item.parent_id || null,
      }));
    }
  } catch (error) {
    console.warn('Failed to fetch menu', error);
  }
};

onMounted(() => {
  fetchMenu();
});
</script>

<style>
#app {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
