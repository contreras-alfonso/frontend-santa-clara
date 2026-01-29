import { format, parse, parseISO, isValid } from 'date-fns';

export function useFilters() {
  const entityStatus = (status: number) => {
    return status === 1 ? 'Activo' : 'Inactivo';
  };

  const entityColorByStatus = (status: string) => {
    return status === 'Activo' ? 'green-6' : 'grey-6';
  };

  const truncate = (value: string, limit: number): string => {
    return value.length < limit ? value : value.slice(0, limit) + '...';
  };

  const formatDate = (value: string, pattern: string = 'dd/MM/yyyy'): string => {
    if (!value) return '';

    let date: Date;

    if (value.includes('-')) {
      date = parseISO(value);
    } else if (value.includes('/')) {
      date = parse(value, 'yyyy/MM/dd', new Date());
    } else {
      return '';
    }

    if (!isValid(date)) return '';

    return format(date, pattern);
  };

  const getFirstTwoWordsFromFullName = (fullName: string) => {
    return fullName.trim().split(/\s+/).slice(0, 2).join(' ');
  };

  return {
    getFirstTwoWordsFromFullName,
    truncate,
    entityStatus,
    entityColorByStatus,
    formatDate,
  };
}
