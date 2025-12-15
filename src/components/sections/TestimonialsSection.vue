<template>
  <section id="testimonials" class="py-20 lg:py-28 bg-gradient-primary text-white overflow-hidden">
    <div class="section-container">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
          <i class="fas fa-quote-left text-secondary"></i>
          <span class="text-white/90 text-sm font-medium">{{ sectionState.badge }}</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {{ sectionState.title }}
        </h2>
        <p class="text-lg text-white/60 max-w-2xl mx-auto">
          {{ sectionState.subtitle }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-16">
        <i class="fas fa-spinner fa-spin text-4xl text-secondary"></i>
      </div>

      <!-- Testimonials Grid -->
      <div v-else-if="testimonials.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          class="glass rounded-2xl p-8 hover:bg-white/20 transition-all duration-500"
        >
          <!-- Rating -->
          <div class="flex gap-1 mb-4">
            <i 
              v-for="star in 5" 
              :key="star"
              class="fas fa-star text-secondary"
            ></i>
          </div>

          <!-- Quote -->
          <p class="text-white/80 leading-relaxed mb-6">
            "{{ stripHtml(testimonial.content) }}"
          </p>

          <!-- Author -->
          <div class="flex items-center gap-4">
            <img 
              v-if="testimonial.avatar"
              :src="testimonial.avatar"
              :alt="testimonial.name"
              class="w-14 h-14 rounded-full object-cover border-2 border-secondary"
            />
            <div 
              v-else
              class="w-14 h-14 rounded-full bg-secondary/30 flex items-center justify-center border-2 border-secondary"
            >
              <i class="fas fa-user text-white text-xl"></i>
            </div>
            <div>
              <h4 class="font-semibold text-white">{{ testimonial.name }}</h4>
              <p class="text-sm text-white/60">{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <p class="text-white/60">Belum ada testimoni tersedia</p>
      </div>

      <!-- Stats -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="(stat, index) in stats" :key="index" class="text-center">
          <div class="text-4xl font-bold text-secondary mb-2">{{ stat.value }}</div>
          <div class="text-white/60">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import API_ENDPOINTS from '@/config/api';

// Storage key untuk cache
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
  badge: 'Testimoni',
  title: 'Apa Kata Mereka?',
  subtitle: 'Kepuasan pengunjung adalah prioritas kami. Berikut pengalaman mereka menemukan coffee shop favorit.',
};

const sectionState = ref({ ...baseSection });
const testimonials = ref([]);
const isLoading = ref(true);

const stats = ref([
  { value: '100+', label: 'Coffee Shop' },
  { value: '5000+', label: 'Pengunjung' },
  { value: '20+', label: 'Kota' },
  { value: '4.8', label: 'Rating' },
]);

// Helper: get cached home data from localStorage
const getCachedHomeData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(HOME_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to read cached home data', error);
    return null;
  }
};

// Helper: parse JSON string or return object
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

// Helper: get item by tag from all data
const getItemByTag = (tag, allData) => {
  const section = allData?.[tag];
  if (!section) return [];
  const parseItem = (item) => parse(item) || {};
  return Array.isArray(section) ? section.map(parseItem) : [parseItem(section)];
};

// Apply content from props or cache
const applyContentFromProps = () => {
  const cached = getCachedHomeData();
  const source =
    (props.pageData && Object.keys(props.pageData || {}).length && props.pageData) ||
    cached ||
    {};

  const getField = (obj, key1, key2) => (obj ? obj[key1] || obj[key2] || '' : '');

  // Get data from tags
  const badgeObj = getItemByTag('testimoni_badge9', source)[0] || {};
  const titleObj = getItemByTag('testimoni_title9', source)[0] || {};

  sectionState.value = {
    badge: getField(badgeObj, 'title', 'content') || baseSection.badge,
    title: getField(titleObj, 'title', 'heading') || baseSection.title,
    subtitle: getField(titleObj, 'content', 'subtitle') || baseSection.subtitle,
  };
};

// Watch for pageData changes
watch(
  () => props.pageData,
  () => applyContentFromProps(),
  { deep: true, immediate: true }
);

// Strip HTML tags for plain text display
const stripHtml = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Fetch testimonials from API
const fetchTestimonials = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_ENDPOINTS.testimonials);
    
    const data = response?.data?.data || response?.data || [];
    
    // Map API response to testimonial format
    testimonials.value = (Array.isArray(data) ? data : []).map(item => ({
      id: item.id,
      name: item.author_name || item.title || 'Anonim',
      role: item.author_position || item.excerpt || '',
      avatar: item.thumbnail_url || null,
      content: item.content || '',
    }));
    
  } catch (error) {
    console.warn('Failed to fetch testimonials, using defaults', error);
    // Fallback to default testimonials
    testimonials.value = [
      {
        id: 1,
        name: 'Budi Santoso',
        role: 'Pengusaha',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        content: 'Pelayanan sangat profesional dan membantu saya menemukan rumah impian dengan harga yang sesuai budget. Terima kasih!',
      },
      {
        id: 2,
        name: 'Siti Rahayu',
        role: 'Dokter',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        content: 'Proses pembelian rumah sangat mudah dan transparan. Tim sangat responsif dalam menjawab semua pertanyaan saya.',
      },
      {
        id: 3,
        name: 'Ahmad Wijaya',
        role: 'Manager',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        content: 'Sangat puas dengan layanan konsultasi investasi properti. Sekarang saya sudah punya 3 unit apartemen untuk passive income.',
      },
    ];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  applyContentFromProps();
  fetchTestimonials();
});
</script>

