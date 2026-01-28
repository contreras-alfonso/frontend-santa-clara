<template>
  <div>
    <q-markup-table flat>
      <thead class="bg-grey-3">
        <tr>
          <th v-for="col in columns" :key="'header' + col" class="text-right">
            <q-skeleton animation="fade" type="text" class="bg-grey-3" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="'row' + row">
          <td
            v-for="col in columns"
            :key="'cell' + row + '-' + col"
            :class="{ 'text-left': col === 1, 'text-right': col !== 1 }"
          >
            <q-skeleton
              animation="fade"
              type="text"
              class="bg-grey-3"
              :width="getColumnWidth(col)"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ rows: number; columns: number }>();

const getColumnWidth = (col: number) => {
  const widths: Record<number, string> = {
    1: '85px',
    2: '50px',
    3: '35px',
    4: '65px',
    5: '25px',
    6: '85px',
  };
  return widths[col] || '50px';
};
</script>

<style lang="scss"></style>
