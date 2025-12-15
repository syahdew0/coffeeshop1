<template>
  <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22><circle cx=%2240%22 cy=%2240%22 r=%222%22 fill=%22white%22/></svg>'); background-size: 80px 80px;"></div>
    </div>

    <!-- Floating Elements -->
    <div class="absolute top-20 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow"></div>
    <div class="absolute bottom-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>

    <div class="section-container relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="space-y-8">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span class="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
            <span class="text-white/90 text-sm font-medium">{{ sectionState.badge }}</span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {{ sectionState.title }}
            <span class="text-gradient block mt-2">{{ sectionState.highlight }}</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg text-white/70 max-w-xl leading-relaxed">
            {{ sectionState.subtitle }}
          </p>

          <!-- Buttons -->
          <div class="flex flex-wrap gap-4">
            <router-link 
              :to="sectionState.primaryButton.link"
              class="btn-primary bg-secondary hover:bg-secondary-600"
            >
              <i class="fas fa-search"></i>
              {{ sectionState.primaryButton.text }}
            </router-link>
            <router-link 
              :to="sectionState.secondaryButton.link"
              class="btn-secondary border-white/30 text-white hover:bg-white/10"
            >
              <i class="fas fa-phone"></i>
              {{ sectionState.secondaryButton.text }}
            </router-link>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap gap-8 pt-8 border-t border-white/10">
            <div v-for="(attr, index) in sectionState.attributes" :key="index" class="text-center">
              <div class="text-3xl font-bold text-secondary">{{ attr.value }}</div>
              <div class="text-white/60 text-sm">{{ attr.label }}</div>
            </div>
          </div>
        </div>

        <!-- Image -->
        <div class="relative">
          <div class="relative z-10">
            <img 
              :src="sectionState.image"
              :alt="sectionState.imageTitle"
              class="w-full h-auto rounded-3xl shadow-2xl"
            />
            <!-- Image Badge -->
            <div class="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <i class="fas fa-coffee text-secondary text-xl"></i>
              </div>
              <div>
                <div class="font-semibold text-primary">{{ sectionState.imageTitle }}</div>
                <div class="text-sm text-slate-500">Premium Coffee</div>
              </div>
            </div>
            <!-- Floating Badge -->
            <div class="absolute -top-4 -right-4 bg-secondary text-white rounded-xl shadow-xl px-4 py-2 flex items-center gap-2">
              <i class="fas fa-star"></i>
              <span class="font-semibold">Top Rated</span>
            </div>
          </div>
          <!-- Decorative Elements -->
          <div class="absolute -z-10 -inset-4 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-2xl"></div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <a href="/#about" class="flex flex-col items-center text-white/60 hover:text-white transition-colors">
        <span class="text-sm mb-2">Scroll Down</span>
        <i class="fas fa-chevron-down"></i>
      </a>
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
  badge: 'Coffee Shop Directory #1 Indonesia',
  title: 'Temukan Coffee Shop',
  highlight: 'Favoritmu',
  subtitle: 'Jelajahi ratusan pilihan coffee shop terbaik dengan suasana nyaman. Kami membantu Anda menemukan tempat ngopi yang sempurna.',
  primaryButton: { text: 'Cari Coffee Shop', link: '/listing' },
  secondaryButton: { text: 'Hubungi Kami', link: '/contact' },
  image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  imageTitle: 'Modern Coffee House',
  attributes: [
    { value: '100+', label: 'Coffee Shop' },
    { value: '5000+', label: 'Pengunjung' },
    { value: '20+', label: 'Kota' },
    { value: '4.8', label: 'Rating' },
  ],
};

const sectionState = ref({ ...baseSection });

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
  const badgeObj = getItemByTag('home_badge9', source)[0] || {};
  const mainObj = getItemByTag('home_main9', source)[0] || {};
  const buttonDaftarObj = getItemByTag('home_buttonDaftar9', source)[0] || {};
  const buttonKonsulObj = getItemByTag('home_buttonKonsul9', source)[0] || {};
  const imageTitleObj = getItemByTag('home_image_title9', source)[0] || {};
  const atributArr = getItemByTag('home_atribut9', source) || [];

  sectionState.value = {
    badge: getField(badgeObj, 'title', 'content') || baseSection.badge,
    title: getField(mainObj, 'title', 'heading') || baseSection.title,
    highlight: getField(imageTitleObj, 'title', 'content') || baseSection.highlight,
    subtitle: getField(mainObj, 'content', 'subtitle') || baseSection.subtitle,
    primaryButton: {
      text: getField(buttonDaftarObj, 'title', 'text') || baseSection.primaryButton.text,
      link: getField(buttonDaftarObj, 'link', 'Link') || baseSection.primaryButton.link,
    },
    secondaryButton: {
      text: getField(buttonKonsulObj, 'title', 'text') || baseSection.secondaryButton.text,
      link: getField(buttonKonsulObj, 'link', 'Link') || baseSection.secondaryButton.link,
    },
    image: imageTitleObj.image || baseSection.image,
    imageTitle: getField(imageTitleObj, 'title', 'content') || baseSection.imageTitle,
    attributes: atributArr.length > 0
      ? atributArr.map(item => ({
          value: getField(item, 'title', 'value') || '',
          label: getField(item, 'content', 'label') || '',
        }))
      : baseSection.attributes,
  };
};

// Watch for pageData changes
watch(
  () => props.pageData,
  () => applyContentFromProps(),
  { deep: true, immediate: true }
);

onMounted(() => {
  applyContentFromProps();
});
</script>
