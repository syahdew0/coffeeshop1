<template>
  <main class="pt-20">
    <!-- Header -->
    <section class="bg-gradient-hero text-white py-16">
      <div class="section-container text-center">
        <div class="section-badge bg-white/10 border-white/20 text-white/90 mx-auto mb-4">
          <i class="fas fa-question-circle"></i>
          <span>Bantuan</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Pusat Bantuan</h1>
        <p class="text-lg text-white/70 max-w-2xl mx-auto">
          Temukan jawaban untuk pertanyaan Anda di sini
        </p>
      </div>
    </section>

    <!-- Search -->
    <section class="bg-white border-b py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari bantuan..."
            class="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-lg"
          />
        </div>
      </div>
    </section>

    <!-- Help Categories -->
    <section class="py-12 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-8 text-center">Kategori Bantuan</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="category in categories"
            :key="category.id"
            class="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
              <i :class="category.icon" class="text-2xl text-secondary group-hover:text-white transition-colors"></i>
            </div>
            <h3 class="font-semibold text-primary mb-2">{{ category.title }}</h3>
            <p class="text-sm text-slate-500">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-primary mb-8 text-center">Pertanyaan Umum</h2>
        
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in filteredFAQs" 
            :key="index"
            class="bg-slate-50 rounded-2xl overflow-hidden"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-100 transition-colors"
            >
              <span class="font-semibold text-primary">{{ faq.question }}</span>
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                :class="[
                  activeFaq === index 
                    ? 'bg-secondary text-white rotate-180' 
                    : 'bg-slate-200 text-slate-500'
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
                <div class="px-6 pb-5 text-slate-600 leading-relaxed">
                  {{ faq.answer }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Still Need Help -->
    <section class="py-16 bg-gradient-primary text-white">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl font-bold mb-4">Masih Butuh Bantuan?</h2>
        <p class="text-white/70 mb-8">
          Tim support kami siap membantu Anda 24/7
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/6281234567890" target="_blank" class="btn-primary bg-green-600 hover:bg-green-700">
            <i class="fab fa-whatsapp"></i>
            Chat WhatsApp
          </a>
          <router-link to="/contact" class="btn-secondary border-white/30 text-white hover:bg-white/10">
            <i class="fas fa-envelope"></i>
            Kirim Email
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const activeFaq = ref(null);

const categories = ref([
  { id: 1, icon: 'fas fa-home', title: 'Properti', description: 'Bantuan terkait pencarian properti' },
  { id: 2, icon: 'fas fa-credit-card', title: 'Pembayaran', description: 'Informasi proses pembayaran' },
  { id: 3, icon: 'fas fa-file-contract', title: 'Legal', description: 'Bantuan dokumen & legalitas' },
  { id: 4, icon: 'fas fa-user', title: 'Akun', description: 'Pengaturan akun Anda' },
]);

const faqs = ref([
  {
    question: 'Bagaimana cara mendaftar sebagai pengguna?',
    answer: 'Anda dapat mendaftar dengan mengklik tombol "Daftar" di bagian atas halaman. Isi formulir pendaftaran dengan data yang valid, kemudian verifikasi email Anda untuk mengaktifkan akun.',
  },
  {
    question: 'Bagaimana proses pembelian properti?',
    answer: 'Proses pembelian dimulai dengan memilih properti yang diinginkan, kemudian menghubungi tim kami untuk jadwal survey. Setelah cocok, proses akan dilanjutkan dengan negosiasi, pengecekan dokumen, dan akad jual beli.',
  },
  {
    question: 'Apakah tersedia fasilitas KPR?',
    answer: 'Ya, kami bekerja sama dengan berbagai bank untuk memudahkan proses KPR. Tim kami akan membantu mengurus semua dokumen yang diperlukan dan mendampingi hingga proses approval.',
  },
  {
    question: 'Berapa lama proses dari survei hingga akad?',
    answer: 'Proses biasanya memakan waktu 2-4 minggu tergantung kelengkapan dokumen. Jika menggunakan KPR, proses bisa memakan waktu 4-8 minggu untuk approval dari bank.',
  },
  {
    question: 'Bagaimana cara menjual properti melalui platform ini?',
    answer: 'Untuk menjual properti, hubungi tim kami melalui form kontak atau WhatsApp. Kami akan melakukan survei dan penilaian properti, kemudian memasarkan properti Anda ke jaringan pembeli kami.',
  },
  {
    question: 'Apakah ada biaya untuk konsultasi?',
    answer: 'Konsultasi awal dengan tim kami gratis. Kami akan membantu Anda memahami kebutuhan dan memberikan rekomendasi properti terbaik tanpa biaya.',
  },
]);

const filteredFAQs = computed(() => {
  if (!searchQuery.value) return faqs.value;
  const query = searchQuery.value.toLowerCase();
  return faqs.value.filter(faq => 
    faq.question.toLowerCase().includes(query) ||
    faq.answer.toLowerCase().includes(query)
  );
});

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};
</script>
