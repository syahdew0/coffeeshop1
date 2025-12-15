<template>
  <footer class="bg-primary text-white">
    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Brand Column -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-6">
            <img 
              v-if="logo" 
              :src="logo" 
              alt="Logo" 
              class="h-10 w-auto brightness-0 invert"
            />
            <span class="text-2xl font-bold">{{ siteName }}</span>
          </div>
          <p class="text-white/70 mb-6 leading-relaxed">
            {{ siteDescription }}
          </p>
          <div class="flex gap-4">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                     hover:bg-secondary hover:text-white transition-all duration-300"
            >
              <i :class="social.icon"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-6">Menu Utama</h3>
          <ul class="space-y-3">
            <li v-for="item in footerMenus" :key="item.id">
              <router-link 
                v-if="!item.path.startsWith('http')"
                :to="item.path"
                class="text-white/70 hover:text-secondary transition-colors"
              >
                {{ item.title }}
              </router-link>
              <a 
                v-else
                :href="item.path"
                :target="item.target"
                class="text-white/70 hover:text-secondary transition-colors"
              >
                {{ item.title }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h3 class="text-lg font-semibold mb-6">Layanan</h3>
          <ul class="space-y-3">
            <li v-for="service in services" :key="service">
              <span class="text-white/70">{{ service }}</span>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-6">Hubungi Kami</h3>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <i class="fas fa-map-marker-alt mt-1 text-secondary"></i>
              <span class="text-white/70">{{ address }}</span>
            </li>
            <li class="flex items-center gap-3">
              <i class="fas fa-phone text-secondary"></i>
              <a :href="`tel:${phone}`" class="text-white/70 hover:text-secondary transition-colors">
                {{ phone }}
              </a>
            </li>
            <li class="flex items-center gap-3">
              <i class="fas fa-envelope text-secondary"></i>
              <a :href="`mailto:${email}`" class="text-white/70 hover:text-secondary transition-colors">
                {{ email }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-white/60 text-sm text-center md:text-left">
            &copy; {{ currentYear }} {{ siteName }}. All rights reserved.
          </p>
          <div class="flex items-center gap-6 text-sm text-white/60">
            <router-link to="/help" class="hover:text-secondary transition-colors">
              Privacy Policy
            </router-link>
            <router-link to="/help" class="hover:text-secondary transition-colors">
              Terms of Service
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import axios from 'axios';
import API_ENDPOINTS, { API_URL } from '@/config/api';

/* global defineProps */
const props = defineProps({
  settings: { type: Object, default: () => ({}) },
});

const siteInfo = inject('siteInfo', {});
const logo = ref('');
const siteName = ref('Coffee Shop');
const siteDescription = ref('Platform direktori coffee shop terlengkap untuk menemukan tempat ngopi favoritmu.');
const footerMenus = ref([]);

const address = ref('Jl. Contoh No. 123, Jakarta');
const phone = ref('+62 21 1234567');
const email = ref('info@coffeeshop.id');

const services = ref([
  'Direktori Coffee Shop',
  'Review & Rating',
  'Info Fasilitas',
  'Daftarkan Coffee Shop',
]);

const socialLinks = ref([
  { name: 'Facebook', icon: 'fab fa-facebook-f', url: '#' },
  { name: 'Instagram', icon: 'fab fa-instagram', url: '#' },
  { name: 'Twitter', icon: 'fab fa-twitter', url: '#' },
  { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: '#' },
]);

const currentYear = computed(() => new Date().getFullYear());

const defaultFooterMenus = [
  { id: 1, title: 'Home', path: '/', target: '_self' },
  { id: 2, title: 'Listing', path: '/listing', target: '_self' },
  { id: 3, title: 'Tentang Kami', path: '/#about', target: '_self' },
  { id: 4, title: 'Layanan', path: '/#services', target: '_self' },
  { id: 5, title: 'FAQ', path: '/#faq', target: '_self' },
  { id: 6, title: 'Kontak', path: '/contact', target: '_self' },
];

// Helper function to join URLs
const joinUrl = (base, path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${cleanBase}/${cleanPath}`;
};

const fetchFooterData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.FOOTER_MENU);
    const data = response?.data?.data || response?.data || {};
    
    if (data.menus && data.menus.length > 0) {
      footerMenus.value = data.menus.map(item => ({
        id: item.id,
        title: item.title || item.label || item.name,
        path: item.path || item.url || item.link || '/',
        target: item.target || '_self',
      }));
    } else {
      footerMenus.value = defaultFooterMenus;
    }
    
    if (data.contact) {
      address.value = data.contact.address || address.value;
      phone.value = data.contact.phone || phone.value;
      email.value = data.contact.email || email.value;
    }
    
    if (data.social && data.social.length > 0) {
      socialLinks.value = data.social;
    }
  } catch (error) {
    console.warn('Failed to fetch footer data, using defaults', error);
    footerMenus.value = defaultFooterMenus;
  }
};

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

onMounted(() => {
  siteName.value = props.settings?.site_title || siteInfo?.site_title || 'Property';
  siteDescription.value = props.settings?.site_description || siteInfo?.site_description || siteDescription.value;
  
  fetchLogo();
  fetchFooterData();
});
</script>
