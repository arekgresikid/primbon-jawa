import { getWeton } from './src/lib/jawaMath.js';
console.log(getWeton(new Date(1945, 7, 17))); // month is 0-indexed, 7 = August
console.log(getWeton(new Date(2024, 0, 1))); // Jan 1, 2024
