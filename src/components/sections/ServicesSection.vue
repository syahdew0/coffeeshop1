<template>
  <section id="services" class="py-20 lg:py-28 bg-white">
    <div class="section-container">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="section-badge mx-auto mb-4">
          <i class="fas fa-concierge-bell"></i>
          <span>{{ sectionState.badge }}</span>
        </div>
        <h2 class="section-title mb-4">{{ sectionState.title }}</h2>
        <p class="section-subtitle mx-auto">{{ sectionState.subtitle }}</p>
      </div>

      <!-- Services Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(service, index) in sectionState.items" 
          :key="index"
          class="group p-8 rounded-2xl bg-accent/30 hover:bg-primary transition-all duration-500 cursor-pointer"
        >
          <!-- Icon -->
          <div 
            class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500"
            :class="[
              'group-hover:bg-white/20',
              'bg-secondary/10'
            ]"
          >
            <i 
              :class="service.icon || 'fas fa-home'"
              class="text-2xl transition-colors duration-500 group-hover:text-white text-secondary"
            ></i>
          </div>

          <!-- Title -->
          <h3 class="text-xl font-bold mb-3 transition-colors duration-500 group-hover:text-white text-primary">
            {{ service.title }}
          </h3>

          <!-- Description -->
          <p class="transition-colors duration-500 group-hover:text-white/80 text-slate-600 leading-relaxed">
            {{ service.content }}
          </p>

          <!-- Arrow -->
          <div class="mt-6 flex items-center gap-2 text-secondary group-hover:text-white transition-colors duration-500 font-medium">
            <span>Pelajari Lebih</span>
            <i class="fas fa-arrow-right transform group-hover:translate-x-2 transition-transform duration-300"></i>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// Storage key for cache
const HOME_PAGE = 'Home';
const HOME_STORAGE_KEY = `customPageData:${HOME_PAGE}`;

/* global defineProps */
const props = defineProps({
  pageData: {
    type: Object,
    default: () => ({}),
  },
});

// Base/default values
const baseSection = {
  badge: 'Fitur Kami',
  title: 'Temukan Coffee Shop Impianmu',
  subtitle: 'Kami menyediakan berbagai fitur untuk membantu Anda menemukan coffee shop terbaik',
  items: [
    {
      icon: 'fas fa-search',
      title: 'Pencarian Mudah',
      content: 'Temukan coffee shop terdekat dengan fitur pencarian dan filter lengkap.',
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Lokasi Akurat',
      content: 'Navigasi langsung ke coffee shop pilihan dengan peta terintegrasi.',
    },
    {
      icon: 'fas fa-star',
      title: 'Review & Rating',
      content: 'Baca ulasan jujur dari pengunjung sebelum mengunjungi.',
    },
    {
      icon: 'fas fa-clock',
      title: 'Jam Operasional',
      content: 'Info jam buka dan tutup yang selalu update real-time.',
    },
    {
      icon: 'fas fa-wifi',
      title: 'Info Fasilitas',
      content: 'WiFi, colokan, smoking area, dan fasilitas lainnya.',
    },
    {
      icon: 'fas fa-coffee',
      title: 'Menu & Harga',
      content: 'Lihat menu dan kisaran harga sebelum berkunjung.',
    },
  ],
};

const sectionState = ref({ ...baseSection });

// Helper functions
const getCachedHomeData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(HOME_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

const parse = (data) => {
  if (!data) return null;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }
  return data;
};

const getItemByTag = (tag, allData) => {
  const section = allData?.[tag];
  if (!section) return [];
  const parseItem = (item) => parse(item) || {};
  return Array.isArray(section) ? section.map(parseItem) : [parseItem(section)];
};

const applyContentFromProps = () => {
  const cached = getCachedHomeData();
  const source =
    (props.pageData && Object.keys(props.pageData || {}).length && props.pageData) ||
    cached ||
    {};

  const getField = (obj, key1, key2) => (obj ? obj[key1] || obj[key2] || '' : '');

  const badgeObj = getItemByTag('service_badge9', source)[0] || {};
  const mainObj = getItemByTag('service_main9', source)[0] || {};
  const itemsArr = getItemByTag('service_item9', source) || [];

  sectionState.value = {
    badge: getField(badgeObj, 'title', 'content') || baseSection.badge,
    title: getField(mainObj, 'title', 'heading') || baseSection.title,
    subtitle: getField(mainObj, 'content', 'subtitle') || baseSection.subtitle,
    items: itemsArr.length > 0
      ? itemsArr.map(item => ({
          icon: item.icon || 'fas fa-check',
          title: getField(item, 'title', 'heading') || '',
          content: getField(item, 'content', 'description') || '',
        }))
      : baseSection.items,
  };
};

watch(
  () => props.pageData,
  () => applyContentFromProps(),
  { deep: true, immediate: true }
);

onMounted(() => {
  applyContentFromProps();
});
</script>
