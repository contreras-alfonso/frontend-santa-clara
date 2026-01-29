<template>
  <q-page class="row">
    <div v-if="!$q.screen.lt.md" class="col-12 col-md-6 col-lg-7 full-height bg-grey-10">
      <q-img spinner-color="grey-5" src="/images/auth.webp" class="full-height">
        <div class="absolute-full bg-gradient"></div>
        <div class="full-width col-12 col-md-7 col-lg-8 full-height flex flex-center">
          <div class="q-pa-lg">
            <div class="row items-center justify-center q-gutter-x-md">
              <div class="text-uppercase text-white text-h3 text-weight-bolder text-center">
                Gestión de Películas
              </div>
            </div>
            <div style="font-size: 20px" class="text-center q-mt-sm">
              Plataforma centralizada para la gestión de películas y turnos.
            </div>
          </div>
        </div>
      </q-img>
    </div>

    <div class="col-12 col-sm-12 col-md-6 col-lg-5">
      <div
        :class="{ 'q-px-lg': $q.screen.lt.sm, 'q-px-xl': !$q.screen.lt.sm }"
        class="flex flex-center full-height"
      >
        <div class="responsive-box">
          <q-form
            @submit="onLogin"
            :class="{ 'q-pa-sm': $q.screen.lt.md }"
            class="column q-col-gutter-y-md"
          >
            <div class="col-12">
              <div class="text-h4 text-weight-bolder text-grey-10 text-center">Iniciar sesión</div>
              <div class="q-mt-sm text-grey-9 text-subtitle1 text-center">
                Ingresa con tu correo y contraseña correspondiente
              </div>
            </div>

            <div class="col-12">
              <InputElement
                label="Correo"
                :model-value="login.email"
                @update:model-value="(val: string) => (login.email = val)"
                time="1500"
                :rules-config="['isRequired', 'isEmail']"
              />
            </div>

            <div class="col-12">
              <InputElement
                label="Contraseña"
                is-pwd
                :model-value="login.password"
                @update:model-value="(val: string) => (login.password = val)"
                time="1500"
                :rules-config="['isRequired']"
              />
            </div>

            <div class="col-12">
              <q-btn
                label="Iniciar Sesión"
                type="submit"
                flat
                no-caps
                class="bg-primary text-weight-medium text-white full-width q-py-md"
              >
                <template v-slot:loading>
                  <q-spinner class="on-left" />
                </template>
              </q-btn>
            </div>
          </q-form>
        </div>
      </div>
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
  email: '',
  password: '',
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
  background: linear-gradient(rgba(0, 0, 0, 0.555), rgba(14, 14, 14, 0.918));
}
.q-page {
  height: 100vh;
  overflow: hidden;
}

.responsive-box {
  width: 100%;
  max-width: 600px;
}

@media (max-width: 1150px) {
  .responsive-box {
    max-width: 500px;
  }
}
</style>
