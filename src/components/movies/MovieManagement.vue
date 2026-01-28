<template>
  <q-drawer
    @hide="onClose"
    v-model="localIsOpen"
    side="right"
    behavior="mobile"
    elevated
    class="q-px-lg q-py-md"
    :width="$q.screen.xs ? 350 : 560"
  >
    <q-form @submit="onSubmit" ref="formShift" class="full-height">
      <div class="column justify-between full-height">
        <q-card-section class="q-px-none q-pt-none">
          <div class="row items-center justify-between">
            <div class="col text-h5 text-weight-bold">
              {{ typeManagement === 'CREATE' ? 'Nueva' : 'Editar' }} {{ props.title }}
            </div>
            <q-btn @click="onClose" icon="close" color="grey-6" size="md" round flat />
          </div>
        </q-card-section>

        <q-separator />

        <q-scroll-area class="col">
          <q-card-section class="q-mt-md q-pa-none row q-col-gutter-y-sm">
            <label class="text-weight-bold text-subtitle1 col-12"
              >Nombre <span class="text-red">*</span></label
            >
            <InputElement
              class="col-12"
              :model-value="localMovie.name"
              @update:model-value="(val: string) => (localMovie.name = val)"
              placeholder="Ejm: Toy Story 5"
              :outlined="true"
              :rules-config="['isRequired']"
              max-length="255"
            />

            <label class="text-weight-bold text-subtitle1 col-12"
              >Fecha de publicación <span class="text-red">*</span></label
            >
            <q-input
              class="col-12"
              label-color="grey-9"
              color="grey-10"
              placeholder="Ejm: 2025/10/23"
              outlined
              v-model="localMovie.publication_date"
              mask="date"
              :rules="['date']"
              hide-bottom-space
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="localMovie.publication_date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <label class="text-weight-bold text-subtitle1 col-12">Imágen</label>
            <q-file
              v-model="fileImage"
              class="col-12"
              label-color="grey-9"
              color="grey-10"
              outlined
              label="Haz click o arrastra tu imágen aquí"
              accept=".jpg,.jpeg,.png"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click.stop.prevent="fileImage = null"
                  class="cursor-pointer"
                />
              </template>
            </q-file>

            <template v-if="localMovie.image || imagePreview">
              <label class="text-weight-bold text-subtitle1 col-12">Previsualización </label>

              <div class="flex flex-center col-12">
                <q-img
                  :src="imagePreview ? imagePreview : localMovie.image!"
                  style="max-width: 200px; max-height: 200px"
                  class="q-mt-md"
                  fit="contain"
                  spinner-color="grey"
                />
              </div>
            </template>

            <label class="text-weight-bold text-subtitle1 col-12"
              >Estado <span class="text-red">*</span></label
            >
            <q-toggle
              v-model="localMovie.status"
              color="green"
              :label="localMovie.status ? 'Activo' : 'Inactivo'"
            />
          </q-card-section>
        </q-scroll-area>

        <q-card-section class="q-px-none q-pb-none">
          <q-separator />
          <q-btn
            class="full-width bg-primary text-white q-py-md"
            type="submit"
            flat
            color="primary"
            label="guardar"
          />
        </q-card-section>
      </div>
    </q-form>
  </q-drawer>
</template>
<script setup lang="ts">
import { QForm } from 'quasar';
import { ref, watch } from 'vue';
import type { TypeManagement } from 'src/types/type-management';
import type { Movie } from 'src/types/movie';
import { useHelpers } from 'src/composables/helpers';
import { useNotify } from 'src/composables/notify';
import { useMovieStore } from 'src/stores/movie-store';
import InputElement from 'src/components/elements/Input.vue';

const { notifySuccess } = useNotify();
const { onSpinner, handleApiError } = useHelpers();
const movieStore = useMovieStore();

const emit = defineEmits(['onSubmit', 'onClose']);

const props = defineProps<{
  isOpen: boolean;
  title: string;
  typeManagement: TypeManagement;
  movie?: Movie | null;
}>();

const fileImage = ref<File | null>(null);
const imagePreview = ref<string>('');

const localMovie = ref<Movie>({
  id: props.movie?.id || null,
  name: props.movie?.name || '',
  publication_date: props.movie?.publication_date || '',
  image: props.movie?.image || null,
  status: props.movie?.status || true,
  shifts: [],
});

const formShift = ref<QForm | null>(null);
const localIsOpen = ref(false);

const onClose = (): void => {
  localIsOpen.value = false;
  emit('onClose');
};

const onSubmit = async () => {
  onSpinner(true);
  const { id, name, publication_date, status } = localMovie.value;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('publication_date', publication_date);
  if (fileImage.value) {
    formData.append('image', fileImage.value);
  }
  formData.append('status', status ? '1' : '0');

  onSpinner(true);
  if (props.typeManagement === 'EDIT') {
    await onUpdate(id!, formData);
  } else if (props.typeManagement === 'CREATE') {
    await onCreate(formData);
  }
};

const onUpdate = async (id: number, formData: FormData) => {
  formData.append('_method', 'PUT');
  try {
    const data = await movieStore.update(id, formData);
    notifySuccess(`${props.title} actualizada correctamente.`);
    emit('onSubmit', data);
    onClose();
  } catch (error) {
    handleApiError(error);
  } finally {
    onSpinner(false);
  }
};

const onCreate = async (formData: FormData) => {
  try {
    const data = await movieStore.create(formData);
    notifySuccess(`${props.title} creada correctamente.`);
    emit('onSubmit', data);
    onClose();
  } catch (error) {
    handleApiError(error);
  } finally {
    onSpinner(false);
  }
};

const onResetFormValidation = () => {
  setTimeout(() => {
    formShift.value?.resetValidation();
  }, 100);
};

watch(
  () => props.isOpen,
  (val: boolean) => {
    localIsOpen.value = val;
    onResetFormValidation();
    if (val) {
      if (props.typeManagement === 'CREATE') {
        localMovie.value.name = '';
        localMovie.value.publication_date = '';
        localMovie.value.image = null;
        localMovie.value.status = true;
      } else {
        localMovie.value.id = props.movie?.id ?? null;
        localMovie.value.name = props.movie?.name ?? '';
        localMovie.value.publication_date = props.movie?.publication_date ?? '';
        localMovie.value.image = props.movie?.image ?? '';
        localMovie.value.status = props.movie?.status ? true : false;
      }
      fileImage.value = null;
      imagePreview.value = '';
    }
  },
);

watch(fileImage, (file) => {
  if (!file) {
    imagePreview.value = '';
    return;
  }
  imagePreview.value = URL.createObjectURL(file);
});
</script>
<style lang="scss"></style>
