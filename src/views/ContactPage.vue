<template>
  <main class="pt-20">
    <!-- Header -->
    <section class="bg-gradient-hero text-white py-16">
      <div class="section-container text-center">
        <div class="section-badge bg-white/10 border-white/20 text-white/90 mx-auto mb-4">
          <i class="fas fa-envelope"></i>
          <span>Kontak</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
        <p class="text-lg text-white/70 max-w-2xl mx-auto">
          Kami siap membantu Anda menemukan coffee shop impian. Hubungi kami kapan saja.
        </p>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16">
          <!-- Contact Info -->
          <div>
            <h2 class="text-2xl font-bold text-primary mb-8">Informasi Kontak</h2>
            
            <div class="space-y-6 mb-10">
              <div class="flex items-start gap-4 p-5 rounded-2xl bg-accent/30">
                <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-map-marker-alt text-secondary text-xl"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-primary mb-1">Alamat</h4>
                  <p class="text-slate-600">Jl. Contoh No. 123, Jakarta Selatan, 12345</p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-5 rounded-2xl bg-accent/30">
                <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-phone text-secondary text-xl"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-primary mb-1">Telepon</h4>
                  <a href="tel:+622112345678" class="text-slate-600 hover:text-secondary transition-colors">
                    +62 21 1234 5678
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-4 p-5 rounded-2xl bg-accent/30">
                <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-envelope text-secondary text-xl"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-primary mb-1">Email</h4>
                  <a href="mailto:info@property.com" class="text-slate-600 hover:text-secondary transition-colors">
                    info@property.com
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-4 p-5 rounded-2xl bg-accent/30">
                <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-clock text-secondary text-xl"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-primary mb-1">Jam Operasional</h4>
                  <p class="text-slate-600">Senin - Sabtu: 09:00 - 18:00</p>
                  <p class="text-slate-600">Minggu: Tutup</p>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <h3 class="font-semibold text-primary mb-4">Ikuti Kami</h3>
            <div class="flex gap-3">
              <a 
                v-for="social in socialLinks" 
                :key="social.name"
                :href="social.url"
                target="_blank"
                class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-secondary transition-colors"
              >
                <i :class="social.icon" class="text-xl"></i>
              </a>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-accent/30 rounded-3xl p-8 lg:p-10">
            <h2 class="text-2xl font-bold text-primary mb-6">Kirim Pesan</h2>
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
                <label class="block text-sm font-medium text-slate-700 mb-2">Subjek</label>
                <select v-model="formData.subject" class="input-field">
                  <option value="">Pilih subjek</option>
                  <option value="general">Pertanyaan Umum</option>
                  <option value="property">Tentang Properti</option>
                  <option value="partnership">Kerjasama</option>
                  <option value="complaint">Keluhan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Pesan</label>
                <textarea 
                  v-model="formData.message"
                  rows="5" 
                  class="textarea-field"
                  placeholder="Tulis pesan Anda di sini..."
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

    <!-- Map -->
    <section class="h-96 bg-slate-200">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2904753608583!2d106.8272291!3d-6.217510!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnMDMuMCJTIDEwNsKwNDknMzguMCJF!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid" 
        width="100%" 
        height="100%" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
});

const socialLinks = ref([
  { name: 'Facebook', icon: 'fab fa-facebook-f', url: '#' },
  { name: 'Instagram', icon: 'fab fa-instagram', url: '#' },
  { name: 'Twitter', icon: 'fab fa-twitter', url: '#' },
  { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: '#' },
  { name: 'WhatsApp', icon: 'fab fa-whatsapp', url: 'https://wa.me/6281234567890' },
]);

const handleSubmit = () => {
  console.log('Form submitted:', formData.value);
  alert('Terima kasih! Pesan Anda telah terkirim.');
  formData.value = { name: '', phone: '', email: '', subject: '', message: '' };
};
</script>
