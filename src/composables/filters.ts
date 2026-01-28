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
  return {
    truncate,
    entityStatus,
    entityColorByStatus,
  };
}
