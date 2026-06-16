import StrategyBuilder from '@/components/StrategyBuilder';
import VolatilitySurface from '@/components/VolatilitySurface';

export default function Home() {
  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight mb-2">
            Options Strategy Builder
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Construct multi-leg options strategies and visualize the payoff curve at expiration. 
            Real-time calculation of portfolio Greeks using the Black-Scholes pricing model.
          </p>
        </div>
        <StrategyBuilder />
      </section>

      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-2">
            Volatility Surface
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Interactive 3D visualization of the implied volatility surface, highlighting the volatility smile across strikes and term structure across expirations.
          </p>
        </div>
        <VolatilitySurface />
      </section>
    </div>
  );
}
