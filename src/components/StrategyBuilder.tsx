'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { PlusCircle, Trash2 } from 'lucide-react';
import { blackScholes, calculateGreeks, OptionParams } from '../lib/black-scholes';

interface OptionPosition {
  id: string;
  type: 'call' | 'put';
  action: 'buy' | 'sell';
  strike: number;
  quantity: number;
  premium: number; // Cost or credit per share
}

const CURRENT_PRICE = 100;
const DTE = 30; // Days to expiration
const RISK_FREE_RATE = 0.05;
const IMPLIED_VOL = 0.25;

export default function StrategyBuilder() {
  const [positions, setPositions] = useState<OptionPosition[]>([
    // Example Iron Condor
    { id: '1', type: 'put', action: 'buy', strike: 90, quantity: 1, premium: 0.50 },
    { id: '2', type: 'put', action: 'sell', strike: 95, quantity: 1, premium: 1.50 },
    { id: '3', type: 'call', action: 'sell', strike: 105, quantity: 1, premium: 1.50 },
    { id: '4', type: 'call', action: 'buy', strike: 110, quantity: 1, premium: 0.50 },
  ]);

  const addPosition = () => {
    setPositions([...positions, {
      id: Math.random().toString(36).substr(2, 9),
      type: 'call',
      action: 'buy',
      strike: CURRENT_PRICE,
      quantity: 1,
      premium: 1.00
    }]);
  };

  const removePosition = (id: string) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const updatePosition = (id: string, field: keyof OptionPosition, value: any) => {
    setPositions(positions.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // Generate payoff chart data
  const chartData = useMemo(() => {
    const data = [];
    for (let price = 70; price <= 130; price += 1) {
      let totalPnL = 0;
      positions.forEach(pos => {
        let payoff = 0;
        if (pos.type === 'call') {
          payoff = Math.max(0, price - pos.strike);
        } else {
          payoff = Math.max(0, pos.strike - price);
        }

        const cost = pos.premium;
        const pnl = pos.action === 'buy' ? payoff - cost : cost - payoff;
        totalPnL += pnl * pos.quantity * 100; // Multiplier is 100
      });
      data.push({ price, pnl: totalPnL });
    }
    return data;
  }, [positions]);

  // Calculate portfolio Greeks
  const portfolioGreeks = useMemo(() => {
    let totals = { delta: 0, gamma: 0, theta: 0, vega: 0 };
    positions.forEach(pos => {
      const params: OptionParams = {
        S: CURRENT_PRICE,
        K: pos.strike,
        T: DTE / 365.0,
        r: RISK_FREE_RATE,
        sigma: IMPLIED_VOL,
        type: pos.type
      };
      
      const greeks = calculateGreeks(params);
      const sign = pos.action === 'buy' ? 1 : -1;
      const mult = pos.quantity * 100;

      totals.delta += greeks.delta * sign * mult;
      totals.gamma += greeks.gamma * sign * mult;
      totals.theta += greeks.theta * sign * mult;
      totals.vega += greeks.vega * sign * mult;
    });
    return totals;
  }, [positions]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Strategy Builder</h2>
        <div className="text-sm font-medium text-slate-500">Underlying: $100.00 | DTE: 30 | IV: 25.0%</div>
      </div>
      
      {/* Portfolio Greeks */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Delta', value: portfolioGreeks.delta },
          { label: 'Gamma', value: portfolioGreeks.gamma },
          { label: 'Theta', value: portfolioGreeks.theta },
          { label: 'Vega', value: portfolioGreeks.vega },
        ].map(g => (
          <div key={g.label} className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{g.label}</div>
            <div className={`text-xl font-bold ${g.value > 0 ? 'text-[#00C29A]' : g.value < 0 ? 'text-rose-500' : 'text-slate-700'}`}>
              {g.value > 0 ? '+' : ''}{g.value.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Positions Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Legs</h3>
            <button 
              onClick={addPosition}
              className="flex items-center text-sm font-bold text-[#00C29A] hover:text-[#009e7d] transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-1" /> Add Leg
            </button>
          </div>
          
          <div className="space-y-3">
            {positions.map(pos => (
              <div key={pos.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-2">
                    <select 
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00C29A]/50 focus:border-[#00C29A]"
                      value={pos.action}
                      onChange={e => updatePosition(pos.id, 'action', e.target.value)}
                    >
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                    <select 
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00C29A]/50 focus:border-[#00C29A]"
                      value={pos.quantity}
                      onChange={e => updatePosition(pos.id, 'quantity', parseInt(e.target.value))}
                    >
                      {[1,2,3,4,5,10].map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                    <select 
                      className="bg-[#111A22] border border-[#283647] rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-[#00C29A]"
                      value={pos.type}
                      onChange={e => updatePosition(pos.id, 'type', e.target.value)}
                    >
                      <option value="call">Call</option>
                      <option value="put">Put</option>
                    </select>
                  </div>
                  <button onClick={() => removePosition(pos.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-slate-500 font-medium">Strike</span>
                    <input 
                      type="number" 
                      className="bg-white border border-slate-300 rounded px-2 py-1 w-20 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00C29A]/50 focus:border-[#00C29A]"
                      value={pos.strike}
                      onChange={e => updatePosition(pos.id, 'strike', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-slate-500 font-medium">Prem.</span>
                    <input 
                      type="number" step="0.01"
                      className="bg-white border border-slate-300 rounded px-2 py-1 w-20 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00C29A]/50 focus:border-[#00C29A]"
                      value={pos.premium}
                      onChange={e => updatePosition(pos.id, 'premium', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PnL Chart */}
        <div className="lg:col-span-2 h-[400px]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">Payoff at Expiration</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="price" 
                stroke="#64748b" 
                tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}}
                domain={['dataMin', 'dataMax']}
                type="number"
                tickCount={10}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#00C29A', fontWeight: 700 }}
                labelFormatter={(val) => `Underlying Price: $${val}`}
                formatter={(val: any) => typeof val === 'number' ? [`$${val.toFixed(2)}`, 'Profit/Loss'] : ['', 'Profit/Loss']}
              />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <ReferenceLine x={CURRENT_PRICE} stroke="#94a3b8" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="pnl" 
                stroke="#00C29A" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#00C29A', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
