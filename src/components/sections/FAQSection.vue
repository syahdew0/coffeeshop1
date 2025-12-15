<template>
  <section id="faq" class="py-20 lg:py-28 bg-accent/30">
    <div class="section-container">
      <div class="grid lg:grid-cols-2 gap-16">
        <!-- Left Column -->
        <div>
          <div class="section-badge mb-4">
            <i class="fas fa-question-circle"></i>
            <span>{{ sectionState.badge }}</span>
          </div>
          <h2 class="section-title mb-6">{{ sectionState.title }}</h2>
          <p class="text-slate-600 leading-relaxed mb-8">
            Temukan jawaban untuk pertanyaan yang sering diajukan. Jika Anda tidak menemukan jawaban yang dicari, jangan ragu untuk menghubungi kami.
          </p>
          <router-link to="/contact" class="btn-primary">
            <i class="fas fa-envelope"></i>
            Hubungi Kami
          </router-link>
        </div>

        <!-- Right Column - FAQ Items -->
        <div class="space-y-4">
          <div 
            v-for="(item, index) in sectionState.items" 
            :key="index"
            class="bg-white rounded-2xl overflow-hidden shadow-sm"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span class="font-semibold text-primary">{{ item.question }}</span>
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                :class="[
                  activeFaq === index 
                    ? 'bg-secondary text-white rotate-180' 
                    : 'bg-slate-100 text-slate-500'
                ]"
              >
                <i class="fas fa-chevron-down transition-transform duration-300"></i>
              </div>
            </button>
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-96 opacity-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="max-h-96 opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div 
                v-show="activeFaq === index"
                class="overflow-hidden"
              >
                <div class="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {{ item.answer }}
                </div>
              </div>
            </transition>
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
  badge: 'FAQ',
  title: 'Pertanyaan yang Sering Diajukan',
  items: [
    {
      question: 'Bagaimana cara mencari coffee shop?',
      answer: 'Gunakan fitur pencarian di website kami. Filter berdasarkan lokasi, fasilitas (WiFi, colokan, smoking area), dan jenis menu untuk menemukan coffee shop yang sesuai.',
    },
    {
      question: 'Apakah informasi harga akurat?',
      answer: 'Kami berusaha memberikan informasi kisaran harga yang update. Namun, harga dapat berubah sewaktu-waktu sesuai kebijakan masing-masing coffee shop.',
    },
    {
      question: 'Bagaimana cara menambahkan coffee shop saya?',
      answer: 'Hubungi tim kami melalui form kontak untuk mendaftarkan coffee shop Anda. Kami akan melakukan verifikasi dan publikasi dalam 1-3 hari kerja.',
    },
    {
      question: 'Apakah bisa booking tempat?',
      answer: 'Saat ini kami belum menyediakan fitur booking. Silakan hubungi langsung coffee shop yang dituju untuk reservasi.',
    },
    {
      question: 'Bagaimana jika informasi tidak akurat?',
      answer: 'Laporkan melalui tombol "report" di halaman detail atau hubungi kami. Tim kami akan memverifikasi dan update informasi secepatnya.',
    },
  ],
};

const sectionState = ref({ ...baseSection });
const activeFaq = ref(0);

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index;
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

  const titleObj = getItemByTag('faq_title9', source)[0] || {};
  const itemsArr = getItemByTag('faq_item9', source) || [];

  sectionState.value = {
    badge: getField(titleObj, 'title', 'badge') || baseSection.badge,
    title: getField(titleObj, 'content', 'title') || baseSection.title,
    items: itemsArr.length > 0
      ? itemsArr.map(item => ({
          question: getField(item, 'title', 'question') || '',
          answer: getField(item, 'content', 'answer') || '',
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
