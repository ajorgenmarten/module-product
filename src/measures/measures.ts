import { TMeasureAcronym, TMeasureType } from './types';

export class Measure {
  constructor(
    private type: TMeasureType,
    private acronym: string,
    private displayName: string
  ) {
    this.validateConstructor();
  }

  private validateConstructor() {
    if (!this.type || !this.acronym || !this.displayName) {
      throw new Error('Todos los campos de la medida son requeridos');
    }
  }

  get Type(): TMeasureType {
    return this.type;
  }

  get Acronym(): string {
    return this.acronym;
  }

  get DisplayName(): string {
    return this.displayName;
  }
}

export class Converter {
  constructor(
    private smallestMeasure: Measure,
    private largestMeasure: Measure,
    private convertFactor: number
  ) {
    this.validateConstructor();
  }

  private validateConstructor() {
    if (this.convertFactor <= 0) {
      throw new Error('El factor de conversión debe ser mayor que 0');
    }
    if (this.smallestMeasure.Type !== this.largestMeasure.Type) {
      throw new Error('Las medidas deben ser del mismo tipo');
    }
  }

  convert(value: number, to: Measure): number {
    if (value < 0) {
      throw new Error('El valor a convertir no puede ser negativo');
    }
    return to.Acronym === this.largestMeasure.Acronym
      ? value / this.convertFactor
      : value * this.convertFactor;
  }

  get SmallestMeasure(): Measure {
    return this.smallestMeasure;
  }

  get LargestMeasure(): Measure {
    return this.largestMeasure;
  }
}

export class MeasureFactoryCore {
  private measures: Measure[] = [];
  private converters: Converter[] = [];

  addMeasure(type: TMeasureType, acronym: string, displayName: string): Measure {
    if (this.existMeasure(acronym)) {
      throw new Error(
        `Ya existe una unidad de medida con la abreviación "${acronym}"`
      );
    }
    const measure = new Measure(type, acronym, displayName);
    this.measures.push(measure);
    return measure;
  }

  addConverter(
    smallestMeasureAcronym: string,
    largestMeasureAcronym: string,
    convertFactor: number
  ): void {
    const smallestMeasure = this.findMeasure(smallestMeasureAcronym);
    const largestMeasure = this.findMeasure(largestMeasureAcronym);

    if (!smallestMeasure || !largestMeasure) {
      throw new Error(
        `Unidad de medida "${smallestMeasureAcronym}" o "${largestMeasureAcronym}" no han sido registradas`
      );
    }

    if (this.existConver(smallestMeasure, largestMeasure)) return;

    const converter = new Converter(smallestMeasure, largestMeasure, convertFactor);
    this.converters.push(converter);
  }

  convert(
    value: number,
    measureAcronym: TMeasureAcronym,
    measureAcronymTo: TMeasureAcronym
  ): number {
    if (measureAcronym === measureAcronymTo) return value;
    
    const converter = this.findConvert(measureAcronym, measureAcronymTo);
    if (!converter) {
      throw new Error(
        `No existe un convertidor de ${measureAcronym} a ${measureAcronymTo}`
      );
    }

    const toMeasure = this.findMeasure(measureAcronymTo);
    if (!toMeasure) {
      throw new Error(`Unidad de medida "${measureAcronymTo}" no encontrada`);
    }

    return converter.convert(value, toMeasure);
  }

  private findMeasure(acronym: string): Measure | undefined {
    return this.measures.find((m) => m.Acronym === acronym);
  }

  private existMeasure(acronym: string): boolean {
    return Boolean(this.findMeasure(acronym));
  }

  private findConvert(
    measureAcronym1: TMeasureAcronym,
    measureAcronym2: TMeasureAcronym
  ): Converter | undefined {
    return this.converters.find((converter) => {
      const isLargestToSmallest =
        converter.LargestMeasure.Acronym === measureAcronym1 &&
        converter.SmallestMeasure.Acronym === measureAcronym2;
      const isSmallestToLargest =
        converter.SmallestMeasure.Acronym === measureAcronym1 &&
        converter.LargestMeasure.Acronym === measureAcronym2;
      return isLargestToSmallest || isSmallestToLargest;
    });
  }

  private existConver(measure1: Measure, measure2: Measure): boolean {
    return Boolean(
      this.findConvert(
        measure1.Acronym as TMeasureAcronym,
        measure2.Acronym as TMeasureAcronym
      )
    );
  }
}