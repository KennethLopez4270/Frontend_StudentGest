<template>
  <div class="home-page">
    <Navbar />
    <Hero />
    <Features />
    <Plans />
    <Benefits />
    <Testimonials />
    <CallToAction />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/landing/Navbar.vue'
import Hero from '@/components/landing/Hero.vue'
import Features from '@/components/landing/Features.vue'
import Plans from '@/components/landing/Plans.vue'
import Benefits from '@/components/landing/Benefits.vue'
import Testimonials from '@/components/landing/Testimonials.vue'
import CallToAction from '@/components/landing/CallToAction.vue'
import Footer from '@/components/landing/Footer.vue'
</script>
