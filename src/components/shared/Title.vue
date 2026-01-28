<template>
  <div
    :class="{ 'text-h5': !$q.screen.lt.sm, 'text-h6': $q.screen.lt.sm }"
    class="text-weight-bold"
  >
    {{ title }}
  </div>
</template>
<script setup lang="ts">
defineProps<{ title: string }>();
</script>
<style lang="scss" scoped></style>
