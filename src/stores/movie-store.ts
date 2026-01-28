import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'boot/axios';
import type { MovieState } from 'src/types/store/movie-state';
import type { Movie } from 'src/types/movie';

export const useMovieStore = defineStore('movie', {
  state: (): MovieState => ({
    movies: [],
  }),

  getters: {
    getAll: (state) => state.movies,
  },

  actions: {
    async fetchAll() {
      const { data } = await api.get<Movie[]>(`/api/movies`);
      this.movies = data;
      return data;
    },

    async create(payload: FormData) {
      const { data } = await api.post<Movie>(`/api/movies`, payload);
      this.movies.unshift(data);
      return data;
    },

    async update(id: number, payload: FormData) {
      const { data } = await api.post<Movie>(`/api/movies/${id}`, payload);
      this.updateInState(data);
    },

    async updateStatus(id: number) {
      const { data } = await api.put<Movie>(`/api/movies/${id}/status`);
      this.updateInState(data);
    },

    async delete(id: number) {
      await api.delete<Movie[]>(`/api/movies/${id}`);
      this.movies = this.movies.filter((movie) => movie.id !== id);
    },

    updateInState(updatedMovie: Movie) {
      const index = this.movies.findIndex((s) => s.id === updatedMovie.id);
      if (index !== -1) {
        this.movies[index] = updatedMovie;
      }
    },

    clear() {
      this.movies = [];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMovieStore, import.meta.hot));
}
