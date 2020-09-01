export default function getRandomNumber(minValue, maxValue) {
  return Math.floor(minValue + Math.random() * (maxValue - minValue - 1));
}
