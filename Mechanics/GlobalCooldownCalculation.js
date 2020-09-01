export default function globalCooldownCalculation(maxValue, value, additionalStep) {
  if (value != 0) {
    value = value - (additionalStep + 1);
  } else if (value == 0) {
    value = maxValue;
  }

  console.log(value);
  return value;
}
