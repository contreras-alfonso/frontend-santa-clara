<template>
  <q-page :class="{ 'q-pb-md': $q.screen.lt.sm }" class="column q-px-md bg-grey-10">
    <q-img spinner-color="white" class="absolute-full" src="/images/auth.webp" fit="cover">
      <div class="absolute-full bg-gradient"></div>
    </q-img>

    <div
      :class="{ '': $q.screen.lt.md, 'q-col-gutter-lg': !$q.screen.lt.md }"
      class="column items-center justify-center col"
    >
      <q-form
        @submit="onLogin"
        :class="{ 'q-pa-sm': $q.screen.lt.md }"
        class="column q-col-gutter-y-md bg-white q-pa-lg"
      >
        <div class="text-center text-grey-10 text-weight-bold text-h4">Iniciar sesión</div>
        <div class="text-center text-black">
          Bienvenido de nuevo. Por favor, inicia sesión para continuar.
        </div>

        <div class="col-12">
          <InputElement
            label="Correo"
            :model-value="login.email"
            @update:model-value="(val: string) => (login.email = val)"
            :outlined="true"
            time="1500"
            bg-color="white"
            border-black
            is-square
            :rules-config="['isRequired', 'isEmail']"
          />
        </div>

        <div class="col-12">
          <InputElement
            label="Contraseña"
            is-pwd
            :model-value="login.password"
            @update:model-value="(val: string) => (login.password = val)"
            :outlined="true"
            time="1500"
            bg-color="white"
            border-black
            is-square
            :rules-config="['isRequired']"
          />
        </div>

        <div class="col-12">
          <q-btn
            label="Iniciar Sesión"
            type="submit"
            flat
            no-caps
            class="bg-primary text-white full-width q-py-md"
          >
            <template v-slot:loading>
              <q-spinner class="on-left" />
            </template>
          </q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import InputElement from 'src/components/elements/Input.vue';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { useNotify } from 'src/composables/notify';
import { useHelpers } from 'src/composables/helpers';
import type { LoginRequest } from 'src/types/login-request';

const { notifySuccess } = useNotify();
const router = useRouter();
const authStore = useAuthStore();
const { handleApiError, onSpinner } = useHelpers();

onMounted(async () => {
  await nextTick();
  if (authStore.isAuthenticated) {
    await router.push('/logout');
  }
});

const login = ref<LoginRequest>({
  email: 'alfonso@gmail.com',
  password: 'alfonso123',
});

const onLogin = async (): Promise<void> => {
  const payload: LoginRequest = {
    ...login.value,
  };

  onSpinner(true);
  try {
    await authStore.login(payload);
    notifySuccess('Sesión iniciada correctamente');
    await router.push('/administracion/peliculas');
  } catch (error) {
    handleApiError(error);
  } finally {
    onSpinner(false);
  }
};
</script>
<style lang="scss" scoped>
.bg-gradient {
  background: linear-gradient(rgba(0, 0, 0, 0.733), rgba(14, 14, 14, 0.918));
}
</style>
