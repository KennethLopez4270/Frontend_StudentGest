<template>
    <div class="login-page">
      <VerifyEmail />
    </div>
  </template>
  
  <script>
  import VerifyEmail from "@/components/VerifyEmailScreen.vue";

  
  export default {
    name: "VerifyEmailView",
    components: {
    VerifyEmail
},
  };
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: url('https://i.pinimg.com/736x/77/ed/d4/77edd4126a0d719976473933f4042f38.jpg'); /* Cambiar ruta de la imagen */
    background-size: cover;
    background-position: center;
  }
  </style>
  