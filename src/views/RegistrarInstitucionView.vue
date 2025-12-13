<template>
  <div class="wrapper">
    <Sidebar />
    <div class="main-content">
      <div class="content-container">
        <RegistrarInstitucion />
      </div>
    </div>
  </div>
</template>

<script>
import RegistrarInstitucion from "@/components/RegistrarInstitucion.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "RegistrarInstitucionView",
  components: {
    RegistrarInstitucion,
    Sidebar
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.main-content {
  width: calc(100% - 250px);
  margin-left: 250px;
  background-image: url('https://i.pinimg.com/736x/77/ed/d4/77edd4126a0d719976473933f4042f38.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-container {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .main-content {
    width: 100%;
    margin-left: 0;
  }
}
</style>
  