<template>
  <main class="pt-20 bg-slate-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
        <p class="text-slate-600">Memuat detail coffee shop...</p>
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="listing">
      <!-- Image Gallery -->
      <section class="bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-3 gap-2 p-2">
            <!-- Main Image -->
            <div class="lg:col-span-2 relative rounded-2xl overflow-hidden h-[400px] lg:h-[500px]">
              <img 
                :src="listing.post?.thumbnail_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'"
                :alt="listing.post?.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-4 left-4">
                <span class="px-4 py-2 rounded-full bg-secondary text-white font-medium">
                  {{ listing.listingType?.name || 'Coffee Shop' }}
                </span>
              </div>
            </div>
            <!-- Side Images -->
            <div v-if="otherImages.length > 0" class="hidden lg:grid grid-rows-2 gap-2">
              <div class="relative rounded-2xl overflow-hidden">
                <img 
                  :src="otherImages[0]"
                  alt="Gallery Image 1"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="relative rounded-2xl overflow-hidden">
                <img 
                  :src="otherImages[1] || otherImages[0]"
                  alt="Gallery Image 2"
                  class="w-full h-full object-cover"
                />
                <button 
                  v-if="otherImages.length > 2"
                  class="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium hover:bg-black/60 transition-colors"
                >
                  <i class="fas fa-images mr-2"></i>
                  +{{ otherImages.length - 2 }} Foto Lainnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Left Column - Details -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Header -->
              <div class="bg-white rounded-2xl p-8">
                <div class="flex flex-wrap items-center gap-2 mb-4">
                  <span 
                    v-for="cat in (listing.post?.categories || [])"
                    :key="cat.id"
                    class="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {{ cat.name }}
                  </span>
                </div>
                <h1 class="text-3xl font-bold text-primary mb-4">
                  {{ listing.post?.title || 'Detail Coffee Shop' }}
                </h1>
                <div class="flex items-center gap-2 text-slate-600 mb-6">
                  <i class="fas fa-map-marker-alt text-secondary"></i>
                  <span>{{ [listing.kecamatan, listing.kabupaten, listing.provinsi].filter(Boolean).join(', ') }}</span>
                </div>
                <div class="text-3xl font-bold text-secondary">
                  {{ formatPrice(listing.price) }}
                </div>
              </div>

              <!-- Features -->
              <div class="bg-white rounded-2xl p-8">
                <h2 class="text-xl font-bold text-primary mb-6">Spesifikasi</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div 
                    v-for="feature in features"
                    :key="feature.label"
                    class="text-center p-4 rounded-xl bg-accent/30"
                  >
                    <i :class="feature.icon" class="text-2xl text-secondary mb-2"></i>
                    <div class="font-bold text-primary">{{ feature.value }}</div>
                    <div class="text-sm text-slate-500">{{ feature.label }}</div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="bg-white rounded-2xl p-8">
                <h2 class="text-xl font-bold text-primary mb-6">Deskripsi</h2>
                <div 
                  class="prose prose-slate max-w-none"
                  v-html="listing.post?.content || listing.post?.excerpt || 'Deskripsi properti belum tersedia.'"
                ></div>
              </div>

              <!-- Additional Info -->
              <div v-if="listing.values && listing.values.length > 0" class="bg-white rounded-2xl p-8">
                <h2 class="text-xl font-bold text-primary mb-6">Informasi Tambahan</h2>
                <div class="grid md:grid-cols-2 gap-4">
                  <div 
                    v-for="val in listing.values"
                    :key="val.tag_name"
                    class="flex items-center justify-between py-3 border-b border-slate-100"
                  >
                    <span class="text-slate-600">{{ val.tag_name }}</span>
                    <span class="font-medium text-primary">{{ val.value }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Contact Card -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl p-8 sticky top-28">
                <h3 class="text-xl font-bold text-primary mb-6">Hubungi Kami</h3>
                <form @submit.prevent="handleInquiry" class="space-y-4">
                  <div>
                    <input 
                      v-model="inquiry.name"
                      type="text" 
                      placeholder="Nama Lengkap"
                      class="input-field"
                      required
                    />
                  </div>
                  <div>
                    <input 
                      v-model="inquiry.phone"
                      type="tel" 
                      placeholder="No. Telepon"
                      class="input-field"
                      required
                    />
                  </div>
                  <div>
                    <input 
                      v-model="inquiry.email"
                      type="email" 
                      placeholder="Email"
                      class="input-field"
                      required
                    />
                  </div>
                  <div>
                    <textarea 
                      v-model="inquiry.message"
                      rows="4" 
                      placeholder="Pesan Anda..."
                      class="textarea-field"
                    ></textarea>
                  </div>
                  <button type="submit" class="btn-primary w-full">
                    <i class="fas fa-paper-plane"></i>
                    Kirim Inquiry
                  </button>
                </form>

                <div class="mt-6 pt-6 border-t border-slate-100">
                  <div class="text-center text-slate-500 mb-4">atau hubungi langsung</div>
                  <div class="flex gap-3">
                    <a 
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      class="flex-1 btn-secondary justify-center text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                    >
                      <i class="fab fa-whatsapp"></i>
                      WhatsApp
                    </a>
                    <a 
                      href="tel:+6281234567890"
                      class="flex-1 btn-secondary justify-center"
                    >
                      <i class="fas fa-phone"></i>
                      Telepon
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Listings -->
      <section v-if="relatedListings.length > 0" class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-primary mb-8">Properti Serupa</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div 
              v-for="item in relatedListings"
              :key="item.post_id"
              class="property-card group"
            >
              <div class="property-card-image">
                <img 
                  :src="item.post?.thumbnail_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'"
                  :alt="item.post?.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div class="property-card-content">
                <h3 class="property-card-title">{{ item.post?.title }}</h3>
                <div class="property-card-location">
                  <i class="fas fa-map-marker-alt text-secondary"></i>
                  <span>{{ item.kecamatan || item.kabupaten }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="property-card-price">{{ formatPrice(item.price) }}</div>
                  <router-link :to="`/listing/${item.post_id}`" class="text-primary hover:text-secondary font-medium">
                    Detail <i class="fas fa-arrow-right ml-1"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Not Found -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <i class="fas fa-coffee text-4xl text-slate-400"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-700 mb-2">Coffee Shop Tidak Ditemukan</h2>
        <p class="text-slate-500 mb-6">Coffee shop yang Anda cari tidak tersedia</p>
        <router-link to="/listing" class="btn-primary">
          <i class="fas fa-arrow-left"></i>
          Kembali ke Listing
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import API_ENDPOINTS from '@/config/api';

const route = useRoute();
const LISTING_TYPE = window.LISTING_TYPE || 1;

const loading = ref(true);
const listing = ref(null);
const allListings = ref([]);

const inquiry = ref({
  name: '',
  phone: '',
  email: '',
  message: '',
});

const features = computed(() => {
  const result = [
    { icon: 'fas fa-users', value: '-', label: 'Kapasitas', tagname: 'kapasitas', suffix: ' orang' },
    { icon: 'fas fa-ruler-combined', value: '-', label: 'Luas Tempat', tagname: 'luas_tempat', suffix: ' m²' },
    { icon: 'fas fa-wifi', value: '-', label: 'WiFi', tagname: 'wifi' },
    { icon: 'fas fa-parking', value: '-', label: 'Parkir', tagname: 'parkir' },
  ];
  
  // Get values from listing using exact tagnames
  if (listing.value?.values) {
    result.forEach((feature, index) => {
      const val = listing.value.values.find(v => v.tag_name === feature.tagname);
      if (val && val.value) {
        result[index].value = feature.suffix ? `${val.value}${feature.suffix}` : val.value;
      }
    });
  }
  
  return result;
});

const otherImages = computed(() => {
  const images = listing.value?.post?.other_images;
  if (!images) return [];
  // Handle if it's a string (JSON) or array
  if (typeof images === 'string') {
    try {
      return JSON.parse(images);
    } catch (e) {
      return [];
    }
  }
  return Array.isArray(images) ? images : [];
});

const relatedListings = computed(() => {
  return allListings.value
    .filter(l => l.post_id !== listing.value?.post_id)
    .slice(0, 3);
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

const handleInquiry = () => {
  console.log('Inquiry submitted:', inquiry.value);
  alert('Terima kasih! Inquiry Anda telah terkirim.');
  inquiry.value = { name: '', phone: '', email: '', message: '' };
};

const fetchListing = async () => {
  loading.value = true;
  try {
    const postId = route.params.id;
    
    // Try to get from detail endpoint
    try {
      const response = await axios.get(API_ENDPOINTS.listingDetail(postId));
      listing.value = response?.data?.data || response?.data;
    } catch (err) {
      // Fallback: fetch all and find by id
      const response = await axios.get(API_ENDPOINTS.listings, {
        params: { listing_type: LISTING_TYPE }
      });
      const data = response?.data?.data || response?.data || [];
      allListings.value = data.filter(l => l.listing_type === LISTING_TYPE);
      listing.value = allListings.value.find(l => 
        l.post_id === parseInt(postId) || l.post_id === postId
      );
    }
    
    // Fetch related listings if not already fetched
    if (allListings.value.length === 0) {
      const response = await axios.get(API_ENDPOINTS.listings, {
        params: { listing_type: LISTING_TYPE }
      });
      const data = response?.data?.data || response?.data || [];
      allListings.value = data.filter(l => l.listing_type === LISTING_TYPE);
    }
  } catch (error) {
    console.error('Failed to fetch listing', error);
    listing.value = null;
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      fetchListing();
    }
  }
);

onMounted(() => {
  fetchListing();
});
</script>
