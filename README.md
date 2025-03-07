## DETALLES A TENER EN CUENTA (Unidades de Medidas)

Para registrar una medida debes hacer uso de la clase `MeasureFactory` y su metodo `addMeasure` te pide como primer parametro el tipo de medida, que esto viene siendo para especificar si es de longitud, de volumen, de peso o de grupo, su abreviacion como segundo parametro y su nombre completo para mostrar como tercer parametro.

Para reigstrar los convertidores que vienen siendo los que transforma de un tipo de media a otra por ejemplo de 'cm' a 'm', se debe hacer uso del metodo `addConverter` debes indicar la abreviacion de una medida ya registrada como primer parametro y el de otra del mismo tipo como segundo, la primera media debe ser menor que la segunda y como tercer valor, por cuanto se debe multiplicar la unidad de medida menor para ser equivalente a la mayor, por ejemplo para agregar un Convertidor que transforme de 'cm' a 'm' y de 'm' a 'cm' seria asi:

```typescript
measurefactory.addConverter('cm', 'm', 100);
```

Para realizar las conversiones entonces seria solo usar el metodo `convert` y pasarle como primer parametro el valor que desea convertir, como segundo la abreviacion de la unidad en la que se encuentra y como tercer parametro la abreviacion de la unidad a la que se decia convertir:

```typescript
measurefactory.convert(30, 'cm', 'm')
```
