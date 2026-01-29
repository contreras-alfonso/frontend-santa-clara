<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary">
      <div class="column">
        <div class="row items-center full-width q-px-md q-py-sm">
          <div class="col-grow">
            <q-img spinner-color="grey" spinner-size="sm" width="40px" src="/images/logo.jpg" />
          </div>

          <div class="col">
            <div class="row justify-center q-col-gutter-x-sm">
              <div v-for="(page, index) in list.nav" :key="index">
                <router-link :to="page.url" v-slot="{ isActive }">
                  <q-btn
                    flat
                    rounded
                    class="fw-400 text-capitalize"
                    :label="page.title"
                    :class="{
                      'bg-white text-primary': isActive,
                      'text-white': !isActive,
                    }"
                  />
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-grow">
            <div class="row items-end justify-end">
              <div class="row items-center text-grey-9 q-gutter-md">
                <div
                  class="row items-center q-col-gutter-x-sm hover-primary cursor-pointer non-selectable"
                >
                  <div>
                    <q-icon size="25px" name="img:/svg/account.svg" />
                  </div>
                  <div v-if="!$q.screen.lt.md" class="text-white">
                    {{ getFirstTwoWordsFromFullName(authStore.getUser?.name ?? '') }}
                  </div>
                  <q-menu>
                    <div style="min-width: 250px" class="q-pa-sm">
                      <q-btn
                        @click="router.push('/logout')"
                        class="full-width bg-negative text-white"
                        icon="exit_to_app"
                        flat
                        label="Cerrar sesión"
                        rounded
                      ></q-btn>
                    </div>
                  </q-menu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { uid } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { useFilters } from 'src/composables/filters';

const authStore = useAuthStore();
const router = useRouter();
const { getFirstTwoWordsFromFullName } = useFilters();

const list = ref({
  nav: [
    {
      id: uid(),
      title: 'Películas',
      url: '/administracion/peliculas',
    },
    {
      id: uid(),
      title: 'Turnos',
      url: '/administracion/turnos',
    },
  ],
});
</script>

<style scoped></style>
