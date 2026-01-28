import { AxiosError } from 'axios';
import { useQuasar } from 'quasar';
import { useNotify } from 'src/composables/notify';
import type { ErrorResponse } from 'src/types/error-response';

export function useHelpers() {
  const $q = useQuasar();
  const { notifyError } = useNotify();

  const onSpinner = (status: boolean) => {
    if (status) {
      $q.loading.show();
    } else {
      $q.loading.hide();
    }
  };

  const handleApiError = (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      notifyError('Ocurrió un error desconocido');
      return;
    }

    const data = error.response?.data as ErrorResponse | undefined;

    if (!data) {
      notifyError('Error inesperado');
      return;
    }

    if (data.errors && Object.keys(data.errors).length > 0) {
      const messages = Object.values(data.errors)
        .map((msg) => `${msg}`)
        .join('<br>');

      notifyError(messages, true);
      return;
    }

    notifyError(data.msg ?? 'Error inesperado');
  };

  const truncate = (value: string, limit: number): string => {
    return value.length < limit ? value : value.slice(0, limit) + '...';
  };

  return {
    onSpinner,
    handleApiError,
    truncate,
  };
}
