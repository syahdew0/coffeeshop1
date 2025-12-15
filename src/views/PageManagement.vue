<template>
  <main class="bg-white text-slate-900">
    <section id="home">
      <HeroSection :pageData="pageData" />
    </section>
    <section id="about">
      <AboutSection :pageData="pageData" />
    </section>
    <section id="properties">
      <PropertyListSection :pageData="pageData" />
    </section>
    <section id="featured">
      <FeaturedPropertiesSection :pageData="pageData" />
    </section>
    <section id="services">
      <ServicesSection :pageData="pageData" />
    </section>
    <section id="testimonials">
      <TestimonialsSection />
    </section>
    <section id="faq">
      <FAQSection :pageData="pageData" />
    </section>
    <section id="contact">
      <ContactSection :pageData="pageData" />
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import API_ENDPOINTS from '@/config/api';

// Import section components
import HeroSection from '@/components/sections/HeroSection.vue';
import AboutSection from '@/components/sections/AboutSection.vue';
import PropertyListSection from '@/components/sections/PropertyListSection.vue';
import FeaturedPropertiesSection from '@/components/sections/FeaturedPropertiesSection.vue';
import ServicesSection from '@/components/sections/ServicesSection.vue';
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue';
import FAQSection from '@/components/sections/FAQSection.vue';
import ContactSection from '@/components/sections/ContactSection.vue';

const HOME_PAGE = 'Home';
const HOME_STORAGE_KEY = `customPageData:${HOME_PAGE}`;

const pageData = ref({});

// Transform API response to key-value format
const transformToKeyValue = (data) => {
  if (!data || !Array.isArray(data)) return {};
  
  const result = {};
  data.forEach(item => {
    const tag = item.tag_name || item.tag;
    if (!tag) return;
    
    // Parse content if it's a string
    let content = item.content;
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        // Keep as string
      }
    }
    
    // Group by tag name
    if (result[tag]) {
      if (Array.isArray(result[tag])) {
        result[tag].push(content);
      } else {
        result[tag] = [result[tag], content];
      }
    } else {
      result[tag] = content;
    }
  });
  
  return result;
};

// Fetch custom page data from API
const fetchPageData = async () => {
  // First check cache
  try {
    const cached = localStorage.getItem(HOME_STORAGE_KEY);
    if (cached) {
      pageData.value = JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Failed to read cached page data', error);
  }
  
  // Then fetch fresh data
  try {
    const response = await axios.get(API_ENDPOINTS.customPages, {
      params: {
        isFrontend: true,
        page: HOME_PAGE
      }
    });
    
    const rawData = response?.data?.data || response?.data || [];
    const transformed = transformToKeyValue(rawData);
    
    // Update state and cache
    pageData.value = transformed;
    localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify(transformed));
  } catch (error) {
    console.warn('Failed to fetch page data', error);
  }
};

onMounted(() => {
  fetchPageData();
});
</script>
