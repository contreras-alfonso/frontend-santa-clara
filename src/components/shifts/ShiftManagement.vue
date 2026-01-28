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
              {{ typeManagement === 'CREATE' ? 'Nuevo' : 'Editar' }} {{ props.title }}
            </div>
            <q-btn @click="onClose" icon="close" color="grey-6" size="md" round flat />
          </div>
        </q-card-section>

        <q-separator />

        <q-scroll-area class="col">
          <q-card-section class="q-mt-md q-pa-none row q-col-gutter-y-sm">
            <label class="text-weight-bold text-subtitle1 col-12"
              >Turno <span class="text-red">*</span></label
            >
            <q-input
              class="col-12"
              name="turno"
              label-color="grey-9"
              color="grey-10"
              placeholder="Ejm: 10:30"
              outlined
              v-model="localShift.start_time"
              mask="time"
              :rules="['time']"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time color="secondary" v-model="localShift.start_time">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="secondary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <label class="text-weight-bold text-subtitle1 col-12"
              >Estado <span class="text-red">*</span></label
            >
            <q-toggle
              v-model="localShift.status"
              color="green"
              :label="localShift.status ? 'Activo' : 'Inactivo'"
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
import type { Shift } from 'src/types/shift';
import type { TypeManagement } from 'src/types/type-management';
import { useHelpers } from 'src/composables/helpers';
import { useNotify } from 'src/composables/notify';
import { useShiftStore } from 'src/stores/shift-store';

const { notifySuccess } = useNotify();
const { onSpinner, handleApiError } = useHelpers();
const shiftStore = useShiftStore();

const emit = defineEmits(['onSubmit', 'onClose']);

const props = defineProps<{
  isOpen: boolean;
  title: string;
  typeManagement: TypeManagement;
  shift?: Shift | null;
}>();

const localShift = ref<Shift>({
  id: props.shift?.id || null,
  start_time: props.shift?.start_time || '',
  status: props.shift?.status || true,
});

const formShift = ref<QForm | null>(null);
const localIsOpen = ref(false);

const onClose = (): void => {
  localIsOpen.value = false;
  emit('onClose');
};

const onSubmit = async () => {
  onSpinner(true);
  const { id, start_time, status } = localShift.value;
  const payload: Shift = {
    id,
    start_time,
    status,
  };
  onSpinner(true);
  if (props.typeManagement === 'EDIT') {
    await onUpdate(payload);
  } else if (props.typeManagement === 'CREATE') {
    await onCreate(payload);
  }
};

const onUpdate = async (payload: Shift) => {
  try {
    const data = await shiftStore.update(payload.id!, payload);
    notifySuccess(`${props.title} actualizado correctamente.`);
    emit('onSubmit', data);
    onClose();
  } catch (error) {
    handleApiError(error);
  } finally {
    onSpinner(false);
  }
};

const onCreate = async (payload: Shift) => {
  try {
    const data = await shiftStore.create(payload);
    notifySuccess(`${props.title} creado correctamente.`);
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
        localShift.value.start_time = '';
        localShift.value.status = true;
      } else {
        localShift.value.id = props.shift?.id!;
        localShift.value.start_time = props.shift?.start_time!;
        localShift.value.status = props.shift?.status! ? true : false;
      }
    }
  },
);
</script>
<style lang="scss"></style>
