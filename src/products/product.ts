import {
  TMeasureAcronym,
  measures,
  Measure,
  MeasureFactory,
} from '../measures';
import * as HELPERS from '../helpers';

const ROUND_PRECISION = 4;

export class Product {
  protected measure: Measure;
  protected detail?: Detail = undefined;

  constructor(
    protected name: string,
    protected quantity: number,
    measure: TMeasureAcronym,
    protected unitaryCost: number,
    protected totalCost: number
  ) {
    this.measure = measures[measure];
    this.validateConstructorParams();
  }

  private validateConstructorParams() {
    if (this.quantity < 0) {
      throw new Error('La cantidad no puede ser negativa');
    }
    if (this.unitaryCost < 0) {
      throw new Error('El costo unitario no puede ser negativo');
    }
    if (this.totalCost < 0) {
      throw new Error('El costo total no puede ser negativo');
    }
  }

  setDetail(quantity: number, measure: TMeasureAcronym) {
    if (this.measure.Type !== 'unity') {
      throw new Error(
        'No se puede agregar detalles a este producto. Para poder agregar detalles a un producto tiene que registrarse con medidas de tipo de grupo, como decenas, docenas o unidades.'
      );
    }

    if (quantity <= 0) {
      throw new Error('La cantidad del detalle debe ser mayor que 0');
    }

    this.detail = new Detail(quantity, measure);
  }

  reduceQuantity(quantity: number, measureAcronym: TMeasureAcronym) {
    if (quantity <= 0) {
      throw new Error('La cantidad a reducir debe ser mayor que 0');
    }

    const measure = measures[measureAcronym];
    this.validateReduceQuantity(quantity, measure);

    if (measure.Type === this.measure.Type) {
      this.reduceDirectQuantity(quantity, measureAcronym);
    } else {
      this.reduceDetailQuantity(quantity, measure);
    }
  }

  private validateReduceQuantity(quantity: number, measure: Measure) {
    if (!this.canBeReduceQuantity(quantity, measure.Acronym as TMeasureAcronym)) {
      throw new Error('No hay suficiente cantidad disponible para reducir');
    }
  }

  private reduceDirectQuantity(quantity: number, measureAcronym: TMeasureAcronym) {
    const converted = MeasureFactory.convert(
      quantity,
      measureAcronym,
      this.measure.Acronym as TMeasureAcronym
    );
    this.quantity = HELPERS.round(
      HELPERS.rest(this.quantity, converted),
      ROUND_PRECISION
    );
  }

  private reduceDetailQuantity(quantity: number, measure: Measure) {
    if (!this.detail || this.detail.Measure.Type !== measure.Type) {
      throw new Error(
        'No se puede reducir una cantidad de diferente tipo de unidad de medida'
      );
    }

    const totalUnities = MeasureFactory.convert(
      this.quantity,
      this.measure.Acronym as TMeasureAcronym,
      'u'
    );
    const totalDetailQuantity = HELPERS.multiplication(totalUnities, this.detail.Quantity);
    const quantityToRestConverted = MeasureFactory.convert(
      quantity,
      measure.Acronym as TMeasureAcronym,
      this.detail.Measure.Acronym as TMeasureAcronym
    );
    const quantityRest = HELPERS.rest(totalDetailQuantity, quantityToRestConverted);
    const newTotalUnities = HELPERS.division(quantityRest, this.detail.Quantity);

    this.quantity = HELPERS.round(
      MeasureFactory.convert(newTotalUnities, 'u', this.measure.Acronym as TMeasureAcronym),
      ROUND_PRECISION
    );
  }

  canBeReduceQuantity(quantity: number, measureAcronym: TMeasureAcronym): boolean {
    if (quantity <= 0) return false;

    const measure = measures[measureAcronym];
    return measure.Type === this.measure.Type
      ? this.canReduceDirectQuantity(quantity, measureAcronym)
      : this.canReduceDetailQuantity(quantity, measure);
  }

  private canReduceDirectQuantity(quantity: number, measureAcronym: TMeasureAcronym): boolean {
    const converted = MeasureFactory.convert(
      quantity,
      measureAcronym,
      this.measure.Acronym as TMeasureAcronym
    );
    return this.quantity >= converted;
  }

  private canReduceDetailQuantity(quantity: number, measure: Measure): boolean {
    if (!this.detail || this.detail.Measure.Type !== measure.Type) {
      throw new Error(
        'No se puede reducir una cantidad de diferente tipo de unidad de medida'
      );
    }

    const unities = MeasureFactory.convert(
      this.quantity,
      this.measure.Acronym as TMeasureAcronym,
      'u'
    );
    const detailTotalQuantity = HELPERS.multiplication(unities, this.detail.Quantity);
    const converted = MeasureFactory.convert(
      quantity,
      measure.Acronym as TMeasureAcronym,
      this.detail.Measure.Acronym as TMeasureAcronym
    );

    return detailTotalQuantity >= converted;
  }

  maxReducesOf(quantity: number, measureAcronym: TMeasureAcronym): number {
    if (quantity <= 0) return 0;

    const measure = measures[measureAcronym];
    return measure.Type === this.measure.Type
      ? this.maxDirectReduces(quantity, measureAcronym)
      : this.maxDetailReduces(quantity, measure);
  }

  private maxDirectReduces(quantity: number, measureAcronym: TMeasureAcronym): number {
    const converted = MeasureFactory.convert(
      quantity,
      measureAcronym,
      this.measure.Acronym as TMeasureAcronym
    );
    return Math.floor(HELPERS.division(this.quantity, converted));
  }

  private maxDetailReduces(quantity: number, measure: Measure): number {
    if (!this.detail || this.detail.Measure.Type !== measure.Type) {
      throw new Error(
        'No se puede reducir una cantidad de diferente tipo de unidad de medida'
      );
    }

    const unities = MeasureFactory.convert(
      this.quantity,
      this.measure.Acronym as TMeasureAcronym,
      'u'
    );
    const detailTotalQuantity = HELPERS.multiplication(unities, this.detail.Quantity);
    const converted = MeasureFactory.convert(
      quantity,
      measure.Acronym as TMeasureAcronym,
      this.detail.Measure.Acronym as TMeasureAcronym
    );

    return Math.floor(HELPERS.division(detailTotalQuantity, converted));
  }

  get Name(): string {
    return this.name;
  }

  get Measure(): string {
    return this.measure.Acronym;
  }

  get Quantity(): number {
    return this.quantity;
  }

  get UnitaryCost(): number {
    return this.unitaryCost;
  }

  get TotalCost(): number {
    return this.totalCost;
  }
}

export class Detail {
  constructor(private quantity: number, private measure: TMeasureAcronym) {
    if (quantity <= 0) {
      throw new Error('La cantidad del detalle debe ser mayor que 0');
    }
  }

  get Quantity(): number {
    return this.quantity;
  }

  get Measure(): Measure {
    return measures[this.measure];
  }
}