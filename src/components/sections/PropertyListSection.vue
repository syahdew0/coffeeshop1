<template>
  <section id="properties" class="py-20 lg:py-28 bg-white">
    <div class="section-container">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="section-badge mx-auto mb-4">
          <i class="fas fa-building"></i>
          <span>{{ sectionState.badge }}</span>
        </div>
        <h2 class="section-title mb-4">{{ sectionState.title }}</h2>
        <p class="section-subtitle mx-auto">{{ sectionState.subtitle }}</p>
      </div>

      <!-- Categories Filter -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="px-5 py-2.5 rounded-full font-medium transition-all duration-300"
          :class="[
            activeCategory === cat.id
              ? 'bg-primary text-white shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Listings Grid -->
      <div v-if="filteredListings.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="listing in filteredListings.slice(0, 6)" 
          :key="listing.post_id"
          class="property-card group"
        >
          <!-- Image -->
          <div class="property-card-image">
            <img 
              :src="listing.post?.thumbnail_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'"
              :alt="listing.post?.title || 'Property'"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="property-card-badge">
              {{ listing.listingType?.name || 'Properti' }}
            </div>
          </div>

          <!-- Content -->
          <div class="property-card-content">
            <h3 class="property-card-title">
              {{ listing.post?.title || 'Properti Unggulan' }}
            </h3>
            <div class="property-card-location">
              <i class="fas fa-map-marker-alt text-secondary"></i>
              <span>{{ listing.kecamatan || listing.kabupaten || 'Jakarta' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="property-card-price">
                {{ formatPrice(listing.price) }}
              </div>
              <router-link 
                :to="`/listing/${listing.post_id}`"
                class="text-primary hover:text-secondary transition-colors font-medium"
              >
                Detail <i class="fas fa-arrow-right ml-1"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <i class="fas fa-home text-4xl text-slate-400"></i>
        </div>
        <h3 class="text-xl font-semibold text-slate-700 mb-2">Belum Ada Listing</h3>
        <p class="text-slate-500">Listing akan segera tersedia</p>
      </div>

      <!-- View All Button -->
      <div class="text-center mt-12">
        <router-link :to="sectionState.buttonLink" class="btn-secondary">
          <span>{{ sectionState.buttonText }}</span>
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import API_ENDPOINTS from '@/config/api';

// Storage key for cache
const HOME_PAGE = 'Home';
const HOME_STORAGE_KEY = `customPageData:${HOME_PAGE}`;

// Get config from window
const LISTING_TYPE = window.LISTING_TYPE || 1;
const LISTING_DISPLAY_IN = window.LISTING_DISPLAY_IN || 8;

/* global defineProps */
const props = defineProps({
  pageData: {
    type: Object,
    default: () => ({}),
  },
});

// Base/default values
const baseSection = {
  badge: 'Properti Kami',
  title: 'Pilihan Properti Terbaik',
  subtitle: 'Temukan berbagai pilihan properti berkualitas tinggi sesuai kebutuhan Anda',
  buttonText: 'Lihat Semua Properti',
  buttonLink: '/listing',
};

const sectionState = ref({ ...baseSection });
const listings = ref([]);
const categories = ref([{ id: null, name: 'Semua' }]);
const activeCategory = ref(null);

const filteredListings = computed(() => {
  if (!activeCategory.value) return listings.value;
  return listings.value.filter(listing => 
    listing.post?.categories?.some(cat => cat.id === activeCategory.value)
  );
});

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

  const badgeObj = getItemByTag('propertyList_badge9', source)[0] || {};
  const mainObj = getItemByTag('propertyList_main9', source)[0] || {};
  const buttonObj = getItemByTag('propertyList_button9', source)[0] || {};

  sectionState.value = {
    badge: getField(badgeObj, 'title', 'content') || baseSection.badge,
    title: getField(mainObj, 'title', 'heading') || baseSection.title,
    subtitle: getField(mainObj, 'content', 'subtitle') || baseSection.subtitle,
    buttonText: getField(buttonObj, 'title', 'text') || baseSection.buttonText,
    buttonLink: getField(buttonObj, 'link', 'Link') || baseSection.buttonLink,
  };
};

const fetchListings = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.listings, {
      params: { listing_type: LISTING_TYPE }
    });
    const data = response?.data?.data || response?.data || [];
    listings.value = data.filter(listing => listing.listing_type === LISTING_TYPE);
    
    // Extract categories from listings
    const categoriesMap = {};
    listings.value.forEach(listing => {
      (listing.post?.categories || []).forEach(cat => {
        if (cat.display_in === LISTING_DISPLAY_IN) {
          categoriesMap[cat.id] = {
            id: cat.id,
            name: cat.name,
            slug: cat.slug
          };
        }
      });
    });
    
    categories.value = [
      { id: null, name: 'Semua' },
      ...Object.values(categoriesMap)
    ];
  } catch (error) {
    console.warn('Failed to fetch listings', error);
  }
};

watch(
  () => props.pageData,
  () => applyContentFromProps(),
  { deep: true, immediate: true }
);

onMounted(() => {
  applyContentFromProps();
  fetchListings();
});
</script>
