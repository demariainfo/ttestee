export interface CrudContract<T> {
  list(): Promise<T[]>;
  create(createDto: any): Promise<T>;
  read(id: number, include?: any): Promise<T>;
  update(id: number, updateDto: any): Promise<T>;
  delete(id: number): Promise<T>;
  deleteBy(where: any): Promise<T>;
  count(): Promise<number>;
  countBy(where: any): Promise<number>;
  findBy(where: any, include?: any): Promise<T[]>;
  findOneBy(where: any, include?: any): Promise<T>;
}
