<template>
  <section id="about" class="bg-accent/30 py-20 lg:py-28">
    <div class="section-container">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Image -->
        <div class="relative">
          <div class="relative z-10">
            <img 
              :src="sectionState.image"
              alt="About Us"
              class="w-full h-auto rounded-3xl shadow-xl"
            />
            <!-- Experience Badge -->
            <div class="absolute -bottom-6 -right-6 bg-secondary text-white rounded-2xl shadow-xl p-6 text-center">
              <div class="text-4xl font-bold">10+</div>
              <div class="text-sm opacity-80">Tahun<br/>Pengalaman</div>
            </div>
          </div>
          <!-- Decorative -->
          <div class="absolute -z-10 top-8 left-8 w-full h-full bg-primary/10 rounded-3xl"></div>
        </div>

        <!-- Content -->
        <div class="space-y-6">
          <!-- Badge -->
          <div class="section-badge">
            <i class="fas fa-info-circle"></i>
            <span>{{ sectionState.badge }}</span>
          </div>

          <!-- Title -->
          <h2 class="section-title">
            {{ sectionState.title }}
          </h2>

          <!-- Description -->
          <p class="text-slate-600 leading-relaxed text-lg">
            {{ sectionState.subtitle }}
          </p>

          <!-- Attributes -->
          <div class="grid grid-cols-2 gap-6 pt-6">
            <div 
              v-for="(attr, index) in sectionState.attributes" 
              :key="index"
              class="flex items-start gap-4"
            >
              <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-check text-secondary text-xl"></i>
              </div>
              <div>
                <h4 class="font-semibold text-primary">{{ attr.title }}</h4>
                <p class="text-sm text-slate-500">{{ attr.content }}</p>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="pt-6">
            <router-link to="/contact" class="btn-primary">
              <i class="fas fa-arrow-right"></i>
              Hubungi Kami
            </router-link>
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
  badge: 'Tentang Kami',
  title: 'Direktori Coffee Shop Terlengkap',
  subtitle: 'Kami menyediakan platform terlengkap untuk menemukan coffee shop terbaik di Indonesia. Dari cafe minimalis hingga roastery premium, temukan tempat ngopi favoritmu dengan mudah.',
  image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  attributes: [
    { title: 'Kurasi Terbaik', content: 'Coffee shop pilihan berkualitas' },
    { title: 'Info Lengkap', content: 'Menu, harga, fasilitas & jam buka' },
    { title: 'Review Jujur', content: 'Ulasan asli dari pengunjung' },
    { title: 'Update Rutin', content: 'Informasi selalu ter-update' },
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
    console.warn('Failed to read cached home data', error);
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

  // Get data from tags
  const badgeObj = getItemByTag('about_badge9', source)[0] || {};
  const mainObj = getItemByTag('about_main9', source)[0] || {};
  const atributArr = getItemByTag('about_atribut9', source) || [];

  sectionState.value = {
    badge: getField(badgeObj, 'title', 'content') || baseSection.badge,
    title: getField(mainObj, 'title', 'heading') || baseSection.title,
    subtitle: getField(mainObj, 'content', 'subtitle') || baseSection.subtitle,
    image: mainObj.image || baseSection.image,
    attributes: atributArr.length > 0
      ? atributArr.map(item => ({
          title: getField(item, 'title', 'heading') || '',
          content: getField(item, 'content', 'description') || '',
        }))
      : baseSection.attributes,
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
