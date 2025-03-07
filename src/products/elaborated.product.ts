import { Product } from './product';
import { Recipe } from './recipe';

export class ElaboratedProduct extends Product {
  constructor(
    name: string,
    quantity: number,
    unitaryCost: number,
    totalCost: number,
    private recipe: Recipe
  ) {
    super(name, quantity, 'u', unitaryCost, totalCost);
  }

  canBeBuild(): boolean {
    return this.recipe.canBuild(this.quantity);
  }

  getMaxBuilds(): number {
    return this.recipe.getMaxBuildableProducts();
  }

  build() {
    this.recipe.build(this.quantity);
  }
}
