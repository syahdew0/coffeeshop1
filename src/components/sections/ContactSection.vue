<template>
  <section id="contact" class="py-20 lg:py-28 bg-white">
    <div class="section-container">
      <div class="grid lg:grid-cols-2 gap-16">
        <!-- Left Column - Info -->
        <div>
          <div class="section-badge mb-4">
            <i class="fas fa-paper-plane"></i>
            <span>{{ sectionState.badge }}</span>
          </div>
          <h2 class="section-title mb-6">{{ sectionState.title }}</h2>
          <p class="text-slate-600 leading-relaxed mb-10">
            {{ sectionState.subtitle }}
          </p>

          <!-- Contact Info Cards -->
          <div class="space-y-6">
            <div 
              v-for="(info, index) in sectionState.contactInfo" 
              :key="index"
              class="flex items-start gap-4 p-5 rounded-2xl bg-accent/30 hover:bg-accent/50 transition-colors"
            >
              <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <i :class="info.icon || 'fas fa-info-circle'" class="text-secondary text-xl"></i>
              </div>
              <div>
                <h4 class="font-semibold text-primary mb-1">{{ info.title }}</h4>
                <a 
                  v-if="info.link"
                  :href="info.link"
                  class="text-slate-600 hover:text-secondary transition-colors"
                >
                  {{ info.value || info.title }}
                </a>
                <span v-else class="text-slate-600">{{ info.value || info.title }}</span>
              </div>
            </div>
          </div>

          <!-- Coffee Shop Options -->
          <div v-if="sectionState.coffeeShopOptions.length > 0" class="mt-10">
            <h4 class="font-semibold text-primary mb-4">Kategori Coffee Shop:</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(option, index) in sectionState.coffeeShopOptions" 
                :key="index"
                class="px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-medium"
              >
                {{ option }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Column - Form -->
        <div class="bg-accent/30 rounded-3xl p-8 lg:p-10">
          <h3 class="text-2xl font-bold text-primary mb-6">Kirim Pesan</h3>
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                <input 
                  v-model="formData.name"
                  type="text" 
                  class="input-field"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">No. Telepon</label>
                <input 
                  v-model="formData.phone"
                  type="tel" 
                  class="input-field"
                  placeholder="+62 812 3456 7890"
                  required
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input 
                v-model="formData.email"
                type="email" 
                class="input-field"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Jenis Pertanyaan</label>
              <select 
                v-model="formData.inquiryType"
                class="input-field"
              >
                <option value="">Pilih jenis pertanyaan</option>
                <option value="info">Informasi Coffee Shop</option>
                <option value="daftar">Daftarkan Coffee Shop</option>
                <option value="kerjasama">Kerjasama</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Pesan</label>
              <textarea 
                v-model="formData.message"
                rows="4" 
                class="textarea-field"
                placeholder="Ceritakan kebutuhan Anda..."
                required
              ></textarea>
            </div>
            <button type="submit" class="btn-primary w-full">
              <i class="fas fa-paper-plane"></i>
              Kirim Pesan
            </button>
          </form>
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
  badge: 'Hubungi Kami',
  title: 'Ada Pertanyaan?',
  subtitle: 'Hubungi tim kami jika ada pertanyaan seputar coffee shop atau ingin mendaftarkan coffee shop Anda.',
  contactInfo: [
    { icon: 'fas fa-map-marker-alt', title: 'Alamat', value: 'Jl. Contoh No. 123, Jakarta', link: null },
    { icon: 'fas fa-phone', title: 'Telepon', value: '+62 21 1234567', link: 'tel:+622112345678' },
    { icon: 'fas fa-envelope', title: 'Email', value: 'info@coffeeshop.id', link: 'mailto:info@coffeeshop.id' },
    { icon: 'fas fa-clock', title: 'Jam Operasional', value: 'Senin - Sabtu: 09:00 - 18:00', link: null },
  ],
  coffeeShopOptions: ['Cafe', 'Roastery', 'Coffee Bar', 'Kedai Kopi', 'Drive Thru'],
};

const sectionState = ref({ ...baseSection });

const formData = ref({
  name: '',
  phone: '',
  email: '',
  inquiryType: '',
  message: '',
});

const handleSubmit = () => {
  console.log('Form submitted:', formData.value);
  // Implement form submission logic here
  alert('Terima kasih! Pesan Anda telah terkirim.');
  formData.value = { name: '', phone: '', email: '', inquiryType: '', message: '' };
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

  const badgeObj = getItemByTag('contact_home_badge9', source)[0] || {};
  const mainObj = getItemByTag('contact_home_main9', source)[0] || {};
  const infoArr = getItemByTag('contact_home_info9', source) || [];
  const optionsArr = getItemByTag('contact_home_optionProperty9', source) || [];

  sectionState.value = {
    badge: getField(badgeObj, 'title', 'content') || baseSection.badge,
    title: getField(mainObj, 'title', 'heading') || baseSection.title,
    subtitle: getField(mainObj, 'content', 'subtitle') || baseSection.subtitle,
    contactInfo: infoArr.length > 0
      ? infoArr.map(item => ({
          icon: item.icon || 'fas fa-info-circle',
          title: getField(item, 'title', 'label') || '',
          value: getField(item, 'content', 'value') || '',
          link: item.link || item.Link || null,
        }))
      : baseSection.contactInfo,
    coffeeShopOptions: optionsArr.length > 0
      ? optionsArr.map(item => getField(item, 'title', 'name'))
      : baseSection.coffeeShopOptions,
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
