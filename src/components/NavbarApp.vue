<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      showSolidNavbar 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
        : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3">
          <img 
            v-if="logo" 
            :src="logo" 
            alt="Logo" 
            class="h-10 w-auto"
          />
          <span 
            class="text-xl font-bold transition-colors duration-300"
            :class="showSolidNavbar ? 'text-primary' : 'text-white'"
          >
            {{ siteTitle }}
          </span>
        </router-link>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center gap-8">
          <template v-for="item in menus" :key="item.id">
            <router-link 
              v-if="!item.path.startsWith('http')"
              :to="item.path"
              class="font-medium transition-colors duration-300 hover:text-secondary"
              :class="showSolidNavbar ? 'text-slate-700' : 'text-white'"
            >
              {{ item.title }}
            </router-link>
            <a 
              v-else
              :href="item.path"
              :target="item.target"
              class="font-medium transition-colors duration-300 hover:text-secondary"
              :class="showSolidNavbar ? 'text-slate-700' : 'text-white'"
            >
              {{ item.title }}
            </a>
          </template>
          <router-link 
            to="/contact" 
            class="btn-primary"
          >
            <i class="fas fa-phone"></i>
            Hubungi Kami
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden p-2 rounded-lg transition-colors"
          :class="showSolidNavbar ? 'text-primary' : 'text-white'"
        >
          <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-2xl"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-show="isMobileMenuOpen"
        class="lg:hidden bg-white shadow-xl border-t"
      >
        <div class="px-4 py-6 space-y-4">
          <template v-for="item in menus" :key="item.id">
            <router-link 
              v-if="!item.path.startsWith('http')"
              :to="item.path"
              @click="isMobileMenuOpen = false"
              class="block py-2 text-slate-700 font-medium hover:text-primary"
            >
              {{ item.title }}
            </router-link>
            <a 
              v-else
              :href="item.path"
              :target="item.target"
              @click="isMobileMenuOpen = false"
              class="block py-2 text-slate-700 font-medium hover:text-primary"
            >
              {{ item.title }}
            </a>
          </template>
          <router-link 
            to="/contact" 
            @click="isMobileMenuOpen = false"
            class="btn-primary w-full justify-center"
          >
            <i class="fas fa-phone"></i>
            Hubungi Kami
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import API_ENDPOINTS, { API_URL } from '@/config/api';

/* global defineProps */
const props = defineProps({
  settings: { type: Object, default: () => ({}) },
  menuItems: { type: Array, default: () => [] },
});

const siteInfo = inject('siteInfo', {});
const route = useRoute();

const logo = ref('');
const siteTitle = ref('Property Template');
const siteDescription = ref('Find Your Dream Property');
const menus = ref([]);
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

// Check if we're on the home page (which has dark hero section)
const isHomePage = computed(() => route.path === '/' || route.path === '');

// Show solid navbar if scrolled OR not on home page
const showSolidNavbar = computed(() => isScrolled.value || !isHomePage.value);

const defaultMenuItems = [
  { id: 1, title: 'Beranda', path: '/' },
  { id: 2, title: 'Properti', path: '/listing' },
  { id: 3, title: 'Blog', path: '/blog' },
  { id: 4, title: 'Bantuan', path: '/help' },
];

// Join URL helper
const joinUrl = (base, path) => {
  if (!base || !path) return path || base || '';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

// Handle scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

// Fetch logo from API
const fetchLogo = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.settingLogo);
    const raw = res?.data?.data || res?.data || {};
    const candidate = raw.logo || raw.icon || raw.value;
    if (candidate) {
      logo.value = /^https?:\/\//i.test(candidate) ? candidate : joinUrl(API_URL, candidate);
    }
  } catch (error) {
    logo.value = props.settings?.logo || siteInfo?.logo || '';
  }
};

// Fetch site settings from API
const websiteId = 1;
const fetchSiteSettings = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.siteSettingsPublic(websiteId));
    const settings = res.data?.settings || res.data?.data || res.data;
    
    if (settings) {
      siteTitle.value = settings.title || settings.site_title || siteTitle.value;
      siteDescription.value = settings.site_description || settings.description || settings.site_tagline || siteDescription.value;
    }
  } catch (err) {
    console.error('Error fetch site settings:', err);
    // Fallback ke props atau default
    siteTitle.value = props.settings?.site_title || siteInfo?.site_title || 'Property Template';
    siteDescription.value = props.settings?.site_tagline || siteInfo?.site_tagline || 'Find Your Dream Property';
  }
};

// Fetch menu from API
const fetchMenu = async () => {
  try {
    const menuGroup = window.MENU_GROUP_SLUG || 'main';
    const response = await axios.get(API_ENDPOINTS.menuListByGroup(menuGroup));
    const items = response?.data?.data || response?.data || [];
    
    if (items.length > 0) {
      menus.value = items.map(item => ({
        id: item.id,
        title: item.title || item.label || item.name,
        path: item.path || item.url || item.link || '/',
        target: item.target || '_self',
        parent_id: item.parent_id || null,
      }));
    } else {
      menus.value = defaultMenuItems;
    }
  } catch (error) {
    console.warn('Failed to fetch menu, using defaults', error);
    menus.value = defaultMenuItems;
  }
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
  
  await fetchLogo();
  await fetchSiteSettings();
  await fetchMenu();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
