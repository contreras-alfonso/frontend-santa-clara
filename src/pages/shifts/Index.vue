<template>
  <q-page padding>
    <div class="row items-center justify-center">
      <div class="col-md-11 col-12 q-gutter-y-md">
        <div class="row justify-between">
          <Title :title="pluralTitle" />

          <div class="row items-center q-col-gutter-x-md">
            <div>
              <InputElement
                :model-value="filter"
                @update:model-value="(val: string) => (filter = val)"
                dense
                placeholder="Buscar"
                icon-color="grey"
                :outlined="true"
                bg-color="white"
                icon="search"
              />
            </div>

            <div>
              <q-btn
                rounded
                @click="onHandleAdd"
                class="bg-primary text-white text-caption q-py-sm full-width"
                icon="add"
                :label="`Nuevo ${singularTitle}`"
                flat
              />
            </div>
          </div>
        </div>

        <TableSkeleton v-if="loading.page" :rows="6" :columns="3" />

        <q-table
          v-else
          class="q-mb-xl"
          :rows="rows"
          :columns="columns"
          :visible-columns="visible"
          row-key="id"
          virtual-scroll
          :grid="$q.screen.xs || $q.screen.sm"
          :dense="$q.screen.lt.md"
          :pagination="pagination"
          :filter="filter"
          flat
        >
          <template v-slot:header="props" v-if="!($q.screen.xs || $q.screen.sm)">
            <q-tr class="bg-primary text-white" :props="props">
              <template v-for="col in props.cols" :key="col.name">
                <q-th :props="props">
                  {{ col.label }}
                </q-th>
              </template>
              <q-th auto-width></q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <template v-for="col in props.cols" :key="col.name">
                <q-td v-if="col.name !== 'status'" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>

                <q-td v-if="col.name === 'status'" :key="col.name" :props="props">
                  <q-badge
                    class="q-px-sm q-py-xs"
                    rounded
                    :color="entityColorByStatus(col.value)"
                    :label="col.value"
                  />
                </q-td>
              </template>

              <q-td auto-width>
                <div class="q-gutter-sm">
                  <slot name="actions-table" :row="props.row"></slot>
                  <q-btn
                    @click="onHandleUpdate(props.row)"
                    icon="edit"
                    class="bg-primary text-white"
                    size="sm"
                    round
                  >
                    <q-tooltip v-if="!$q.screen.lt.sm" class="bg-grey-8 shadow-1 text-center">
                      Editar
                    </q-tooltip>
                  </q-btn>

                  <q-btn
                    @click="onHandleUpdateStatus(props.row.id)"
                    :icon="props.row.status === 1 ? 'lock' : 'lock_open'"
                    class="bg-deep-purple-5 text-white"
                    size="sm"
                    round
                  >
                    <q-tooltip v-if="!$q.screen.lt.sm" class="bg-grey-8 shadow-1 text-center">
                      Actualizar estado
                    </q-tooltip>
                  </q-btn>

                  <q-btn
                    @click="onHandleDelete(props.row.id)"
                    icon="fa-regular fa-trash-can"
                    class="bg-negative text-white"
                    size="sm"
                    round
                  >
                    <q-tooltip v-if="!$q.screen.lt.sm" class="bg-grey-8 shadow-1 text-center">
                      Eliminar
                    </q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>

          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-4">
              <div class="q-table__grid-item-card q-table__card q-ma-xs">
                <div class="q-table__grid-item-row" v-for="col in props.cols" :key="col.name">
                  <div class="q-table__grid-item-title">
                    {{ col.label }}
                  </div>
                  <div class="q-table__grid-item-value">
                    {{ col.value }}
                  </div>
                </div>
                <div class="q-table__grid-item-row">
                  <div class="q-table__grid-item-title">Acciones</div>
                  <div class="q-table__grid-item-value">
                    <div class="q-gutter-sm">
                      <slot name="actions-table-movil" :row="props.row"></slot>
                      <q-chip
                        class="q-py-md"
                        round
                        clickable
                        label="Editar"
                        icon="edit"
                        color="primary"
                        text-color="white"
                        size="sm"
                        @click="onHandleUpdate(props.row)"
                      >
                      </q-chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>

  <ConfirmDelete
    v-if="dialogs.delete.isOpen"
    :id="dialogs.delete.entityId!"
    :msg="`el ${singularTitle}`"
    @on-delete="onDeleteShift"
    @on-close="onCloseDeleteDialog"
  />

  <ShiftManagement
    :is-open="dialogs.management.isOpen"
    :title="singularTitle"
    :type-management="dialogs.management.type"
    :shift="dialogs.management.entity"
    @on-close="onCloseManagementDrawer"
  />
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import InputElement from 'src/components/elements/Input.vue';
import Title from 'src/components/shared/Title.vue';
import type { ColumnTable } from 'src/types/column-table';
import type { Shift } from 'src/types/shift';
import type { DeleteDialog } from 'src/types/delete-dialog';
import type { ManagementDrawer } from 'src/types/management-drawer';
import { useShiftStore } from 'src/stores/shift-store';
import { useHelpers } from 'src/composables/helpers';
import { useFilters } from 'src/composables/filters';
import { useNotify } from 'src/composables/notify';
import TableSkeleton from 'src/components/shared/TableSkeleton.vue';
import ConfirmDelete from 'src/components/shared/ConfirmDelete.vue';
import ShiftManagement from 'src/components/shifts/ShiftManagement.vue';

const { handleApiError, onSpinner } = useHelpers();
const { entityStatus, entityColorByStatus } = useFilters();
const { notifySuccess } = useNotify();
const shiftStore = useShiftStore();

const $q = useQuasar();
const { t } = useI18n();

const singularTitle = t('page.administration.shifts.title', 1);
const pluralTitle = t('page.administration.shifts.title', 2);

const dialogs = ref<{ delete: DeleteDialog; management: ManagementDrawer<Shift> }>({
  delete: {
    isOpen: false,
    entityId: null,
  },
  management: {
    isOpen: false,
    type: 'CREATE',
    entity: null,
  },
});

const pagination = ref({
  page: 1,
  rowsPerPage: $q.screen.lt.sm ? 5 : 20,
});

const loading = ref({
  page: false,
});

const filter = ref<string>('');

const visible: string[] = ['id', 'start_time', 'status'];

const columns: ColumnTable[] = [
  {
    name: 'id',
    label: 'Id',
    field: 'id',
    align: 'center',
    sortable: true,
  },
  {
    name: 'start_time',
    label: 'Turno',
    field: 'start_time',
    align: 'center',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'status',
    align: 'center',
    sortable: true,
    format: (val) => entityStatus(val),
  },
];

const rows = ref<Shift[]>([]);

onMounted(async () => {
  await onLoad();
});

const onLoad = async () => {
  loading.value.page = true;
  await Promise.all([fetchAll()])
    .then(() => {})
    .finally(() => {
      loading.value.page = false;
    });
};

const fetchAll = async () => {
  try {
    await shiftStore.fetchAll();
  } catch (error) {
    handleApiError(error);
  }
};

const onHandleUpdate = (shift: Shift) => {
  dialogs.value.management.isOpen = true;
  dialogs.value.management.type = 'EDIT';
  dialogs.value.management.entity = shift;
  console.log(dialogs.value.management.entity);
};

const onHandleAdd = () => {
  dialogs.value.management.isOpen = true;
  dialogs.value.management.type = 'CREATE';
  dialogs.value.management.entity = null;
};

const onCloseDeleteDialog = () => {
  dialogs.value.delete.isOpen = false;
};

const onHandleUpdateStatus = async (id: number) => {
  if (id) {
    onSpinner(true);
    try {
      await shiftStore.updateStatus(id);
      notifySuccess(`Estado actualizado correctamente`);
    } catch (error) {
      handleApiError(error);
    } finally {
      onSpinner(false);
    }
  }
};

const onHandleDelete = (id: number) => {
  if (id) {
    dialogs.value.delete.isOpen = true;
    dialogs.value.delete.entityId = id;
  }
};

const onDeleteShift = async () => {
  if (dialogs.value.delete.entityId) {
    onSpinner(true);
    try {
      await shiftStore.delete(dialogs.value.delete.entityId);
      notifySuccess(`${singularTitle} eliminado correctamente`);
    } catch (error) {
      handleApiError(error);
    } finally {
      onSpinner(false);
      onCloseDeleteDialog();
    }
  }
};

const onCloseManagementDrawer = () => {
  dialogs.value.management.isOpen = false;
};

watch(
  () => shiftStore.shifts,
  (newValue: Shift[]) => {
    rows.value = newValue;
  },
);
</script>
<style lang=""></style>
