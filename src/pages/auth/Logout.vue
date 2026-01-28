<template>
  <div></div>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth-store';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  authStore.logout();
  await router.push('/login');
});
</script>

<style scoped></style>
