export function useFilters() {
  const entityStatus = (status: number) => {
    return status === 1 ? 'Activo' : 'Inactivo';
  };

  const entityColorByStatus = (status: string) => {
    return status === 'Activo' ? 'green-6' : 'grey-6';
  };
  return {
    entityStatus,
    entityColorByStatus,
  };
}
