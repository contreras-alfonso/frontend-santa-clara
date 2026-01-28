import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'boot/axios';
import type { Shift } from 'src/types/shift';
import type { ShiftState } from 'src/types/store/shift-state';

export const useShiftStore = defineStore('shift', {
  state: (): ShiftState => ({
    shifts: [],
  }),

  getters: {
    getAll: (state) => state.shifts,
    getById: (state) => (id: number) => state.shifts.find((shift) => shift.id === id),
  },

  actions: {
    async fetchAll() {
      const { data } = await api.get<Shift[]>(`/api/shifts`);
      this.shifts = data;
      return data;
    },

    async create(formData: FormData) {
      const { data } = await api.post<Shift>(`/api/shifts`, formData);
      this.shifts.push(data);
      return data;
    },

    async update(id: number, shift: Shift) {
      const { data } = await api.put<Shift>(`/api/shifts/${id}`, shift);
      const findIndex = this.shifts.findIndex((shift) => shift.id === id);
      if (findIndex !== -1) this.shifts[findIndex] = data;
    },

    async updateStatus(id: number) {
      const { data } = await api.put<Shift>(`/api/shifts/${id}/status`);
      const findIndex = this.shifts.findIndex((shift) => shift.id === id);
      if (findIndex !== -1) this.shifts[findIndex] = data;
    },

    async delete(id: number) {
      await api.delete<Shift[]>(`/api/shifts/${id}`);
      this.shifts = this.shifts.filter((shift) => shift.id !== id);
    },

    clear() {
      this.shifts = [];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShiftStore, import.meta.hot));
}
