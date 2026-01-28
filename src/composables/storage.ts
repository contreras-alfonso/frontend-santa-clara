import { LocalStorage, SessionStorage } from 'quasar';

export function useStorage() {
  const getStorage = (key: string) => {
    if (LocalStorage.has(key)) {
      return LocalStorage.getItem(key);
    } else if (SessionStorage.has(key)) {
      return SessionStorage.getItem(key);
    }
    return null;
  };

  const setStorage = <T>(key: string, value: T | null) => {
    if (value === null) {
      if (LocalStorage.has(key)) {
        LocalStorage.remove(key);
      } else if (SessionStorage.has(key)) {
        SessionStorage.remove(key);
      }
    } else {
      LocalStorage.set(key, value);
    }
  };

  return {
    getStorage,
    setStorage,
  };
}
