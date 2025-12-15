<template>
  <main class="pt-20">
    <!-- Header -->
    <section class="bg-gradient-hero text-white py-16">
      <div class="section-container text-center">
        <div class="section-badge bg-white/10 border-white/20 text-white/90 mx-auto mb-4">
          <i class="fas fa-newspaper"></i>
          <span>Blog</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Artikel & Berita</h1>
        <p class="text-lg text-white/70 max-w-2xl mx-auto">
          Dapatkan informasi terbaru seputar properti, tips investasi, dan berita industri
        </p>
      </div>
    </section>

    <!-- Blog Grid -->
    <section class="py-12 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="posts.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="post in posts" 
            :key="post.id"
            class="card card-hover group"
          >
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="post.thumbnail_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute top-4 left-4">
                <span 
                  v-for="cat in (post.categories || []).slice(0, 1)"
                  :key="cat.id"
                  class="px-3 py-1 rounded-full bg-secondary text-white text-xs font-medium"
                >
                  {{ cat.name }}
                </span>
              </div>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-4 text-sm text-slate-500 mb-3">
                <span class="flex items-center gap-1">
                  <i class="fas fa-calendar-alt"></i>
                  {{ formatDate(post.created_at) }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="fas fa-user"></i>
                  {{ post.author?.name || 'Admin' }}
                </span>
              </div>
              <h2 class="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                {{ post.title }}
              </h2>
              <p class="text-slate-600 text-sm line-clamp-3 mb-4">
                {{ post.excerpt || 'Baca selengkapnya untuk informasi lebih lanjut...' }}
              </p>
              <a 
                :href="`/blog/${post.slug}`"
                class="inline-flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors"
              >
                Baca Selengkapnya
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <i class="fas fa-newspaper text-4xl text-slate-400"></i>
          </div>
          <h3 class="text-xl font-semibold text-slate-700 mb-2">Belum Ada Artikel</h3>
          <p class="text-slate-500">Artikel akan segera tersedia</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import API_ENDPOINTS from '@/config/api';

const posts = ref([]);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const fetchPosts = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.allPosts());
    posts.value = response?.data?.data || response?.data || [];
  } catch (error) {
    console.warn('Failed to fetch posts', error);
  }
};

onMounted(() => {
  fetchPosts();
});
</script>
