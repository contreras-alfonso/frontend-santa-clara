import { useQuasar } from 'quasar';

export function useNotify() {
  const $q = useQuasar();

  const notifySuccess = (message: string) => {
    $q.notify({
      message,
      color: 'positive',
      icon: 'check_circle',
      progress: false,
      position: 'top',
      actions: [{ icon: 'close', color: 'white', size: 'xs', round: true }],
    });
  };

  const notifyError = (message: string, html: boolean = false) => {
    $q.notify({
      message,
      color: 'negative',
      icon: 'error',
      progress: false,
      position: 'top',
      html,
      actions: [{ icon: 'close', color: 'white', size: 'sm', round: true }],
    });
  };

  const notifyInfo = (message: string, icon: string = 'info') => {
    $q.notify({
      message,
      color: 'secondary',
      icon,
      timeout: 2000,
      progress: false,
      position: 'top',
      actions: [{ icon: 'close', color: 'white', size: 'xs', round: true }],
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
  };
}
