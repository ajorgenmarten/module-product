import { MeasureFactoryCore } from './measures';

const measurefactory = new MeasureFactoryCore();

const m = measurefactory.addMeasure('length', 'm', 'metro');
const cm = measurefactory.addMeasure('length', 'cm', 'centimetro');
const mm = measurefactory.addMeasure('length', 'mm', 'milimetro');

const lb = measurefactory.addMeasure('weight', 'lb', 'libra');
const kg = measurefactory.addMeasure('weight', 'kg', 'kilogramo');
const g = measurefactory.addMeasure('weight', 'g', 'gramo');
const mg = measurefactory.addMeasure('weight', 'mg', 'miligramo');

const u = measurefactory.addMeasure('unity', 'u', 'unidad');
const dec = measurefactory.addMeasure('unity', 'dec', 'decenas');
const doc = measurefactory.addMeasure('unity', 'doc', 'docenas');

const ml = measurefactory.addMeasure('volume', 'ml', 'mililitro');
const l = measurefactory.addMeasure('volume', 'l', 'litro');
const cl = measurefactory.addMeasure('volume', 'cl', 'centilitro');

measurefactory.addConverter('mm', 'cm', 10);
measurefactory.addConverter('mm', 'm', 1000);
measurefactory.addConverter('cm', 'm', 100);

measurefactory.addConverter('mg', 'g', 1000);
measurefactory.addConverter('mg', 'lb', 453592.37);
measurefactory.addConverter('mg', 'kg', 1000000);
measurefactory.addConverter('g', 'lb', 453.59);
measurefactory.addConverter('g', 'kg', 1000);
measurefactory.addConverter('lb', 'kg', 2.2046);

measurefactory.addConverter('u', 'dec', 10);
measurefactory.addConverter('u', 'doc', 12);
measurefactory.addConverter('dec', 'doc', 1.2);

measurefactory.addConverter('ml', 'cl', 10);
measurefactory.addConverter('ml', 'l', 1000);
measurefactory.addConverter('cl', 'l', 100);

export const measures = {
  m,
  cm,
  mm,
  lb,
  kg,
  g,
  mg,
  u,
  dec,
  doc,
  ml,
  l,
  cl,
};

export const MeasureFactory = measurefactory;
