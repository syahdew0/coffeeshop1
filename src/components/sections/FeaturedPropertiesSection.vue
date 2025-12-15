<template>
  <section id="featured" class="py-20 lg:py-28 bg-accent/30">
    <div class="section-container">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
        <div>
          <div class="section-badge mb-4">
            <i class="fas fa-star"></i>
            <span>{{ sectionState.badge }}</span>
          </div>
          <h2 class="section-title mb-4">{{ sectionState.title }}</h2>
          <p class="section-subtitle">{{ sectionState.subtitle }}</p>
        </div>
        <router-link :to="sectionState.buttonLink" class="btn-primary whitespace-nowrap">
          <span>{{ sectionState.buttonText }}</span>
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>

      <!-- Featured Listings -->
      <div v-if="featuredListings.length > 0" class="grid lg:grid-cols-2 gap-8">
        <!-- Main Featured -->
        <div 
          v-if="featuredListings[0]"
          class="property-card group row-span-2"
        >
          <div class="relative h-80 lg:h-full overflow-hidden">
            <img 
              :src="featuredListings[0].post?.thumbnail_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'"
              :alt="featuredListings[0].post?.title || 'Featured Property'"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <div class="inline-block px-3 py-1 rounded-full bg-secondary text-white text-sm font-medium mb-4">
                {{ featuredListings[0].listingType?.name || 'Featured' }}
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">
                {{ featuredListings[0].post?.title || 'Premium Property' }}
              </h3>
              <div class="flex items-center gap-2 text-white/80 mb-4">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ featuredListings[0].kecamatan || featuredListings[0].kabupaten || 'Jakarta' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-2xl font-bold text-secondary">
                  {{ formatPrice(featuredListings[0].price) }}
                </div>
                <router-link 
                  :to="`/listing/${featuredListings[0].post_id}`"
                  class="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                >
                  Lihat Detail
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Side Featured -->
        <div class="space-y-8">
          <div 
            v-for="listing in featuredListings.slice(1, 3)" 
            :key="listing.post_id"
            class="property-card group flex flex-col sm:flex-row overflow-hidden"
          >
            <div class="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
              <img 
                :src="listing.post?.thumbnail_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'"
                :alt="listing.post?.title || 'Property'"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div class="p-6 flex flex-col justify-between">
              <div>
                <div class="inline-block px-2 py-1 rounded text-xs font-medium bg-secondary/10 text-secondary mb-2">
                  {{ listing.listingType?.name || 'Properti' }}
                </div>
                <h3 class="font-bold text-primary mb-1 line-clamp-2">
                  {{ listing.post?.title || 'Properti Unggulan' }}
                </h3>
                <div class="flex items-center gap-1 text-slate-500 text-sm">
                  <i class="fas fa-map-marker-alt text-secondary"></i>
                  <span>{{ listing.kecamatan || listing.kabupaten || 'Jakarta' }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between mt-4">
                <div class="text-lg font-bold text-secondary">
                  {{ formatPrice(listing.price) }}
                </div>
                <router-link 
                  :to="`/listing/${listing.post_id}`"
                  class="text-primary hover:text-secondary transition-colors text-sm font-medium"
                >
                  Detail <i class="fas fa-arrow-right ml-1"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <i class="fas fa-star text-4xl text-slate-400"></i>
        </div>
        <h3 class="text-xl font-semibold text-slate-700 mb-2">Belum Ada Featured Listing</h3>
        <p class="text-slate-500">Listing unggulan akan segera tersedia</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import API_ENDPOINTS from '@/config/api';

// Storage key for cache
const HOME_PAGE = 'Home';
const HOME_STORAGE_KEY = `customPageData:${HOME_PAGE}`;

const LISTING_TYPE = window.LISTING_TYPE || 1;

/* global defineProps */
const props = defineProps({
  pageData: {
    type: Object,
    default: () => ({}),
  },
});

// Base/default values
const baseSection = {
  badge: 'Rekomendasi',
  title: 'Properti Pilihan Untuk Anda',
  subtitle: 'Properti terbaik yang kami rekomendasikan berdasarkan kualitas dan lokasi strategis',
  buttonText: 'Lihat Semua',
  buttonLink: '/listing',
};

const sectionState = ref({ ...baseSection });
const featuredListings = ref([]);

const formatPrice = (price) => {
  if (!price) return 'Hubungi Kami';
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

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

  const badgeObj = getItemByTag('recommend_badge9', source)[0] || {};
  const mainObj = getItemByTag('recommend_main9', source)[0] || {};
  const buttonObj = getItemByTag('recommend_button9', source)[0] || {};

  sectionState.value = {
    badge: getField(badgeObj, 'title', 'content') || baseSection.badge,
    title: getField(mainObj, 'title', 'heading') || baseSection.title,
    subtitle: getField(mainObj, 'content', 'subtitle') || baseSection.subtitle,
    buttonText: getField(buttonObj, 'title', 'text') || baseSection.buttonText,
    buttonLink: getField(buttonObj, 'link', 'Link') || baseSection.buttonLink,
  };
};

const fetchFeaturedListings = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.listings, {
      params: { listing_type: LISTING_TYPE }
    });
    const data = response?.data?.data || response?.data || [];
    featuredListings.value = data
      .filter(listing => listing.listing_type === LISTING_TYPE)
      .slice(0, 3);
  } catch (error) {
    console.warn('Failed to fetch featured listings', error);
  }
};

watch(
  () => props.pageData,
  () => applyContentFromProps(),
  { deep: true, immediate: true }
);

onMounted(() => {
  applyContentFromProps();
  fetchFeaturedListings();
});
</script>
