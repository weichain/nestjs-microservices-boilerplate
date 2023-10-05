export interface Mapper<E, D> {
  entityToDto(entity: E): D;
  dtoToEntity(dto: D): E;
}
