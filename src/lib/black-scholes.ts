// Standard Normal cumulative distribution function
function CND(x: number): number {
  const a1 = 0.31938153, a2 = -0.356563782, a3 = 1.781477937, a4 = -1.821255978, a5 = 1.330274429;
  const L = Math.abs(x);
  const K = 1.0 / (1.0 + 0.2316419 * L);
  let w = 1.0 - 1.0 / Math.sqrt(2 * Math.PI) * Math.exp(-L * L / 2) * (a1 * K + a2 * K * K + a3 * Math.pow(K, 3) + a4 * Math.pow(K, 4) + a5 * Math.pow(K, 5));
  if (x < 0) {
    w = 1.0 - w;
  }
  return w;
}

// Standard Normal probability density function
function ND(x: number): number {
  return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

export interface OptionParams {
  S: number;      // Spot price
  K: number;      // Strike price
  T: number;      // Time to maturity in years
  r: number;      // Risk-free interest rate
  sigma: number;  // Volatility
  type: 'call' | 'put';
}

export function blackScholes({ S, K, T, r, sigma, type }: OptionParams): number {
  if (T <= 0) {
    return type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
  }

  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2.0) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  if (type === 'call') {
    return S * CND(d1) - K * Math.exp(-r * T) * CND(d2);
  } else {
    return K * Math.exp(-r * T) * CND(-d2) - S * CND(-d1);
  }
}

export function calculateGreeks({ S, K, T, r, sigma, type }: OptionParams) {
  if (T <= 0) return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };

  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2.0) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const delta = type === 'call' ? CND(d1) : CND(d1) - 1;
  const gamma = ND(d1) / (S * sigma * Math.sqrt(T));
  const vega = S * ND(d1) * Math.sqrt(T);
  
  const theta1 = -(S * ND(d1) * sigma) / (2 * Math.sqrt(T));
  const thetaCall = theta1 - r * K * Math.exp(-r * T) * CND(d2);
  const thetaPut = theta1 + r * K * Math.exp(-r * T) * CND(-d2);
  const theta = type === 'call' ? thetaCall : thetaPut;

  const rhoCall = K * T * Math.exp(-r * T) * CND(d2);
  const rhoPut = -K * T * Math.exp(-r * T) * CND(-d2);
  const rho = type === 'call' ? rhoCall : rhoPut;

  return { delta, gamma, theta: theta / 365, vega: vega / 100, rho: rho / 100 };
}
