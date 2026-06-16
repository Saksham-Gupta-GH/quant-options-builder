export function generateVolatilitySurface() {
  const strikes = [];
  const maturities = []; // in days
  const ivMatrix = [];

  // Generate strikes from 80 to 120
  for (let k = 80; k <= 120; k += 2) {
    strikes.push(k);
  }

  // Generate maturities from 10 to 360 days
  for (let t = 10; t <= 360; t += 10) {
    maturities.push(t);
  }

  // Generate IVs: Smile shape across strikes, slight term structure across maturities
  for (let i = 0; i < maturities.length; i++) {
    const t = maturities[i];
    const rowIVs = [];
    for (let j = 0; j < strikes.length; j++) {
      const k = strikes[j];
      
      // Base IV
      let iv = 0.20; 
      
      // Volatility Smile (higher IV for OTM/ITM)
      const moneyness = k / 100.0;
      const smile = Math.pow(moneyness - 1.0, 2) * 2.5;
      
      // Term structure (IV decreases slightly with longer maturity)
      const term = 1.0 / Math.sqrt(t);
      
      iv = iv + smile + term * 0.1;
      
      rowIVs.push(iv);
    }
    ivMatrix.push(rowIVs);
  }

  return { strikes, maturities, ivMatrix };
}
