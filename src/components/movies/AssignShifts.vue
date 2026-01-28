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
            <div class="col text-h5 text-weight-bold">Asignar turnos</div>
            <q-btn @click="onClose" icon="close" color="grey-6" size="md" round flat />
          </div>
        </q-card-section>

        <q-separator />

        <q-scroll-area class="col">
          <q-card-section class="q-mt-md q-pa-none row q-col-gutter-y-sm">
            <div class="col-12">
              <div class="row q-col-gutter-x-md">
                <div class="col-3">
                  <q-img
                    fit="contain"
                    class="full-width"
                    spinner-color="grey"
                    spinner-size="sm"
                    :src="localMovie.image ? localMovie.image : '/images/no-image.jpg'"
                  />
                </div>
                <div class="col-9">
                  <div class="row">
                    <div class="col-12 text-weight-bold text-subtitle1">{{ localMovie.name }}</div>
                    <div class="col-12">
                      <div>{{ formatDate(localMovie.publication_date) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="text-weight-bold text-subtitle1 col-12">Selecciona los turnos:</label>

              <div>
                <div class="row q-col-gutter-sm q-mt-sm">
                  <div v-for="shift in shiftStore.getAll" :key="shift.id!" class="col-6">
                    <q-card
                      flat
                      bordered
                      class="cursor-pointer shift-card"
                      :class="{
                        selected: isSelected(shift.id!),
                        disabled: isDisabled(shift),
                        locked: shift.status === 0 && isSelected(shift.id!),
                      }"
                      @click="toggleShift(shift)"
                    >
                      <q-card-section class="row items-center justify-between q-pa-sm">
                        <div class="text-weight-medium">
                          {{ shift.start_time }}
                        </div>

                        <q-icon
                          v-if="isSelected(shift.id!)"
                          name="check_circle"
                          color="positive"
                          size="20px"
                        />

                        <q-icon
                          v-else-if="isDisabled(shift)"
                          name="lock"
                          color="grey-6"
                          size="20px"
                        />
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
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
import type { Movie } from 'src/types/movie';
import { useHelpers } from 'src/composables/helpers';
import { useNotify } from 'src/composables/notify';
import { useMovieStore } from 'src/stores/movie-store';
import { useShiftStore } from 'src/stores/shift-store';
import { useFilters } from 'src/composables/filters';
import { Shift } from 'src/types/shift';

const { formatDate } = useFilters();
const { notifySuccess } = useNotify();
const { onSpinner, handleApiError } = useHelpers();
const movieStore = useMovieStore();
const shiftStore = useShiftStore();

const emit = defineEmits(['onSubmit', 'onClose']);

const props = defineProps<{
  isOpen: boolean;
  movie?: Movie | null;
}>();

const localMovie = ref<Movie>({
  id: props.movie?.id || null,
  name: props.movie?.name || '',
  publication_date: props.movie?.publication_date || '',
  image: props.movie?.image || null,
  status: props.movie?.status || true,
  shifts: [],
});

const localIsOpen = ref(true);

const onClose = (): void => {
  localIsOpen.value = false;
  emit('onClose');
};

const isSelected = (shiftId: number): boolean => {
  return localMovie.value.shifts.includes(shiftId);
};

const isDisabled = (shift: any): boolean => {
  return shift.status === 0 && !isSelected(shift.id);
};

const canToggle = (shift: any): boolean => {
  return shift.status === 1 || isSelected(shift.id);
};

const toggleShift = (shift: Shift): void => {
  if (!canToggle(shift)) return;

  const index = localMovie.value.shifts.indexOf(shift.id!);

  if (index === -1) {
    localMovie.value.shifts.push(shift.id!);
  } else {
    localMovie.value.shifts.splice(index, 1);
  }
};

const onSubmit = async () => {
  onSpinner(true);
  const { id, name, publication_date, status } = localMovie.value;

  try {
    const data = await movieStore.update(id, formData);
    notifySuccess(` actualizada correctamente.`);
    // emit('onSubmit', data);
    onClose();
  } catch (error) {
    handleApiError(error);
  } finally {
    onSpinner(false);
  }
};

watch(
  () => props.isOpen,
  (val: boolean) => {
    console.log(val);
    localIsOpen.value = val;
    localMovie.value.image = props.movie?.image ?? '';
    localMovie.value.name = props.movie?.name ?? '';
    localMovie.value.publication_date = props.movie?.publication_date ?? '';
    localMovie.value.status = props.movie?.status ?? false;
    localMovie.value.shifts = props.movie?.shifts ?? [];
  },
);
</script>
<style lang="scss">
.shift-card {
  transition: all 0.2s ease;

  &.selected {
    border-color: $positive;
    background: rgba($positive, 0.08);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.locked {
    border-color: $warning;
    background: rgba($warning, 0.08);
  }
}
</style>
