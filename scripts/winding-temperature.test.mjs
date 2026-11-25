import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateWindingTemperature, COPPER_CONSTANT, parseDecimal} from '../src/components/WindingTemperature/engine.mjs';

const sample = {coldResistance: .5, warmResistance: .65, coldTemperature: 20};
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9);
test('copper constant and absolute temperature', () => {
  assert.equal(COPPER_CONSTANT, 234.5);
  const result = calculateWindingTemperature(sample);
  close(result.warmTemperature, 96.35);
  close(result.changeFromCold, 76.35);
  assert.equal(result.temperatureRise, null);
});
test('end ambient is separate and optional', () => {
  close(calculateWindingTemperature({...sample, ambientEnd: 35}).temperatureRise, 61.35);
});
test('same resistance units cancel and identical resistances give cold temperature', () => {
  close(calculateWindingTemperature({...sample, coldResistance: 500, warmResistance: 650}).warmTemperature, 96.35);
  close(calculateWindingTemperature({...sample, warmResistance: .5}).warmTemperature, 20);
});
test('validates finite positive resistances and physical temperatures', () => {
  for (const change of [{coldResistance: 0}, {warmResistance: -1}, {coldTemperature: NaN}, {constant: 0}, {ambientEnd: Infinity}, {coldTemperature: -235}]) {
    assert.equal(calculateWindingTemperature({...sample, ...change}), null);
  }
});
test('decimal comma and decimal dot are supported, malformed input rejected', () => {
  assert.equal(parseDecimal('0,500'), .5);
  assert.equal(parseDecimal('0.650'), .65);
  assert.equal(parseDecimal('-5,2'), -5.2);
  for (const invalid of ['', '0x20', '1,2.3', 'Infinity']) assert.ok(Number.isNaN(parseDecimal(invalid)));
});
