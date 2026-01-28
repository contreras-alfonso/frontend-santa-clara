<template>
  <q-dialog v-model="isOpen" @hide="emit('onClose')">
    <q-card class="q-pa-lg bg-grey-1" style="width: 500px">
      <q-card-section class="q-ma-none q-px-none q-pt-none">
        <div class="row items-end justify-end">
          <div>
            <q-btn
              icon="close"
              color="grey-6"
              size="md"
              flat
              round
              dense
              @click="emit('onClose')"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-px-none q-pt-none q-pb-lg">
        <div class="column q-col-gutter-y-xs">
          <div class="row items-center justify-center">
            <q-avatar size="xl" class="bg-red-1">
              <q-icon name="warning" size="sm" color="negative"></q-icon>
            </q-avatar>
          </div>
          <div class="text-grey-9 text-weight-bold text-h6 text-center q-mt-md">
            Confirmar eliminación, Id: {{ id }}
          </div>
          <div class="text-center text-grey-9">
            Esta acción eliminará para siempre {{ msg }}. ¿Estás seguro de continuar?
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-ma-none q-px-none q-pb-none">
        <div class="full-width">
          <div
            :class="{
              'q-col-gutter-y-md column reverse': $q.screen.lt.sm,
              'q-col-gutter-x-md row items-center': !$q.screen.lt.sm,
            }"
          >
            <div :class="{ 'col-12': $q.screen.lt.sm, 'col-6': !$q.screen.lt.sm }">
              <q-btn
                flat
                @click="emit('onClose')"
                class="full-width q-py-sm text-weight-bold bg-grey-3 text-grey-9"
                no-caps
                label="No, cancelar"
              />
            </div>
            <div :class="{ 'col-12': $q.screen.lt.sm, 'col-6': !$q.screen.lt.sm }">
              <q-btn
                @click="emit('onDelete')"
                icon="fa-regular fa-trash-can"
                class="full-width bg-negative text-white q-py-sm text-weight-regular"
                flat
                no-caps
                label="Sí, continuar"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['onDelete', 'onClose']);
defineProps<{ msg: string; id: number }>();
const isOpen = ref(true);
</script>
<style lang=""></style>
