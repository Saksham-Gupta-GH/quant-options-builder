import StrategyBuilder from '@/components/StrategyBuilder';
import VolatilitySurface from '@/components/VolatilitySurface';

export default function Home() {
  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2 flex items-center">
            Options Strategy Builder
          </h1>
          <p className="text-slate-600 max-w-3xl text-base leading-relaxed">
            Construct multi-leg options strategies and visualize the payoff curve at expiration. 
            Real-time calculation of portfolio Greeks using the Black-Scholes pricing model.
          </p>
        </div>
        <StrategyBuilder />
      </section>

      <section>
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
            Volatility Surface
          </h2>
          <p className="text-slate-600 max-w-3xl text-base leading-relaxed">
            Interactive 3D visualization of the implied volatility surface, highlighting the volatility smile across strikes and term structure across expirations.
          </p>
        </div>
        <VolatilitySurface />
      </section>
    </div>
  );
}
