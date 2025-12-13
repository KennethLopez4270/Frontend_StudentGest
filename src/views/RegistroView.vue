<template>
  <div class="registro-page">
    <RegistroForm />
  </div>
</template>

<script>
import RegistroForm from "@/components/RegistroForm.vue";

export default {
  name: "RegistroView",
  components: { RegistroForm },
};
</script>

<style scoped>
.registro-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('https://i.pinimg.com/736x/77/ed/d4/77edd4126a0d719976473933f4042f38.jpg');
  background-size: cover;
  background-position: center;
  padding: 20px 0;
}
</style>
