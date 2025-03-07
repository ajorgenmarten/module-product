import { RawMaterial } from './types';
import * as HELPERS from '../helpers';

export class Recipe {
  private rawMaterials: RawMaterial[];

  constructor(private name: string, ...rawMaterials: RawMaterial[]) {
    this.rawMaterials = rawMaterials;
    this.validateRawMaterials();
  }

  private validateRawMaterials() {
    if (this.rawMaterials.some(({ quantity }) => quantity <= 0)) {
      throw new Error(
        'Las cantidades de materias primas deben ser mayores que 0'
      );
    }
  }

  canBuild(quantity: number = 1): boolean {
    if (quantity < 1) {
      throw new Error(
        'La cantidad a construir tiene que ser mayor o igual a 1'
      );
    }

    return this.rawMaterials.every(
      ({ measure, product, quantity: rawMaterialQuantity }) => {
        const totalQuantity = HELPERS.multiplication(
          quantity,
          rawMaterialQuantity
        );
        return product.canBeReduceQuantity(totalQuantity, measure);
      }
    );
  }

  build(quantity: number = 1): void {
    if (!this.canBuild(quantity)) {
      throw new Error(
        'No hay suficientes materias primas para construir la cantidad especificada'
      );
    }

    for (const { measure, product, quantity: requiredQuantity } of this
      .rawMaterials) {
      const totalQuantity = HELPERS.multiplication(quantity, requiredQuantity);
      product.reduceQuantity(totalQuantity, measure);
    }
  }

  getMaxBuildableProducts(): number {
    if (this.rawMaterials.length === 0) return 0;

    return Math.min(
      ...this.rawMaterials.map(
        ({ measure, product, quantity: requiredQuantity }) =>
          product.maxReducesOf(requiredQuantity, measure)
      )
    );
  }

  get Name(): string {
    return this.name;
  }

  get RawMaterials(): ReadonlyArray<RawMaterial> {
    return this.rawMaterials;
  }
}
