<template>
  <main class="pt-20">
    <!-- Header -->
    <section class="bg-gradient-hero text-white py-16">
      <div class="section-container text-center">
        <div class="section-badge bg-white/10 border-white/20 text-white/90 mx-auto mb-4">
          <i class="fas fa-coffee"></i>
          <span>Daftar Coffee Shop</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Temukan Coffee Shop Favoritmu</h1>
        <p class="text-lg text-white/70 max-w-2xl mx-auto">
          Jelajahi berbagai pilihan coffee shop terbaik dengan suasana nyaman dan kopi berkualitas
        </p>
      </div>
    </section>

    <!-- Filters & Search -->
    <section class="bg-white border-b sticky top-20 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col lg:flex-row gap-4 items-center">
          <!-- Search -->
          <div class="relative flex-grow w-full lg:w-auto">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari coffee shop..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          
          <!-- Category Filter -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="activeCategory = cat.id"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
              :class="[
                activeCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              ]"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Listings Grid -->
    <section class="py-12 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Results Count -->
        <div class="mb-8 flex items-center justify-between">
          <p class="text-slate-600">
            Menampilkan <span class="font-semibold text-primary">{{ paginatedListings.length }}</span> dari 
            <span class="font-semibold text-primary">{{ filteredListings.length }}</span> coffee shop
          </p>
          <select v-model="sortBy" class="px-4 py-2 rounded-lg border border-slate-200 text-sm">
            <option value="newest">Terbaru</option>
            <option value="price-low">Harga Terendah</option>
            <option value="price-high">Harga Tertinggi</option>
          </select>
        </div>

        <!-- Grid -->
        <div v-if="paginatedListings.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="listing in paginatedListings" 
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
              <!-- Quick Actions -->
              <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                  <i class="far fa-heart"></i>
                </button>
                <button class="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                  <i class="fas fa-share-alt"></i>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="property-card-content">
              <div class="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span v-for="cat in (listing.post?.categories || []).slice(0, 2)" :key="cat.id" class="px-2 py-1 rounded bg-slate-100">
                  {{ cat.name }}
                </span>
              </div>
              <h3 class="property-card-title">
                {{ listing.post?.title || 'Properti Unggulan' }}
              </h3>
              <div class="property-card-location">
                <i class="fas fa-map-marker-alt text-secondary"></i>
                <span>{{ [listing.kecamatan, listing.kabupaten].filter(Boolean).join(', ') || 'Jakarta' }}</span>
              </div>
              
              <!-- Features -->
              <div class="flex items-center gap-4 text-sm text-slate-500 mb-4 border-t border-slate-100 pt-4">
                <span v-for="feat in getFeatures(listing)" :key="feat.icon" class="flex items-center gap-1">
                  <i :class="feat.icon" class="text-secondary"></i>
                  {{ feat.value }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <div class="property-card-price">
                  {{ formatPrice(listing.price) }}
                </div>
                <router-link 
                  :to="`/listing/${listing.post_id}`"
                  class="btn-primary py-2 px-4 text-sm"
                >
                  Detail
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <i class="fas fa-search text-4xl text-slate-400"></i>
          </div>
          <h3 class="text-xl font-semibold text-slate-700 mb-2">Tidak ada coffee shop ditemukan</h3>
          <p class="text-slate-500 mb-6">Coba ubah filter atau kata kunci pencarian Anda</p>
          <button @click="resetFilters" class="btn-secondary">
            Reset Filter
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-2">
          <button 
            @click="currentPage = currentPage - 1"
            :disabled="currentPage === 1"
            class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
            :class="[
              currentPage === page
                ? 'bg-primary text-white'
                : 'border border-slate-200 hover:bg-slate-100'
            ]"
          >
            {{ page }}
          </button>
          <button 
            @click="currentPage = currentPage + 1"
            :disabled="currentPage === totalPages"
            class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import API_ENDPOINTS from '@/config/api';

// Get config from window
const LISTING_TYPE = window.LISTING_TYPE || 1;
const LISTING_DISPLAY_IN = window.LISTING_DISPLAY_IN || 8;

const listings = ref([]);
const categories = ref([{ id: null, name: 'Semua' }]);
const activeCategory = ref(null);
const searchQuery = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);
const itemsPerPage = 9;

const filteredListings = computed(() => {
  let result = [...listings.value];
  
  // Filter by category
  if (activeCategory.value) {
    result = result.filter(listing => 
      listing.post?.categories?.some(cat => cat.id === activeCategory.value)
    );
  }
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(listing => 
      listing.post?.title?.toLowerCase().includes(query) ||
      listing.kecamatan?.toLowerCase().includes(query) ||
      listing.kabupaten?.toLowerCase().includes(query)
    );
  }
  
  // Sort
  if (sortBy.value === 'price-low') {
    result.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
  }
  
  return result;
});

const totalPages = computed(() => Math.ceil(filteredListings.value.length / itemsPerPage));

const paginatedListings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredListings.value.slice(start, start + itemsPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(5, total);
    } else {
      start = Math.max(1, total - 4);
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
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

const getFeatures = (listing) => {
  const features = [];
  const values = listing.values || [];
  
  // Find features using exact tagnames from coffee shop schema
  const kapasitasVal = values.find(v => v.tag_name === 'kapasitas');
  const luasTempatVal = values.find(v => v.tag_name === 'luas_tempat');
  const wifiVal = values.find(v => v.tag_name === 'wifi');
  const parkirVal = values.find(v => v.tag_name === 'parkir');
  
  if (kapasitasVal) features.push({ icon: 'fas fa-users', value: `${kapasitasVal.value} org` });
  if (luasTempatVal) features.push({ icon: 'fas fa-ruler-combined', value: `${luasTempatVal.value} m²` });
  if (wifiVal) features.push({ icon: 'fas fa-wifi', value: wifiVal.value });
  if (parkirVal) features.push({ icon: 'fas fa-parking', value: parkirVal.value });
  
  // Fallback with default values if no features found
  if (features.length === 0) {
    features.push({ icon: 'fas fa-users', value: '-' });
    features.push({ icon: 'fas fa-ruler-combined', value: '-' });
    features.push({ icon: 'fas fa-wifi', value: '-' });
  }
  
  return features.slice(0, 3);
};

const resetFilters = () => {
  activeCategory.value = null;
  searchQuery.value = '';
  sortBy.value = 'newest';
  currentPage.value = 1;
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

onMounted(() => {
  fetchListings();
});
</script>
