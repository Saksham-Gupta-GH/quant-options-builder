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
    <div className="bg-white rounded-[24px] border border-[#DADCE0] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-normal text-[#202124]">Strategy Builder</h2>
        <div className="text-sm font-medium text-[#5F6368]">Underlying: $100.00 | DTE: 30 | IV: 25.0%</div>
      </div>
      
      {/* Portfolio Greeks */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Delta', value: portfolioGreeks.delta },
          { label: 'Gamma', value: portfolioGreeks.gamma },
          { label: 'Theta', value: portfolioGreeks.theta },
          { label: 'Vega', value: portfolioGreeks.vega },
        ].map(g => (
          <div key={g.label} className="bg-white rounded-xl p-4 border border-[#DADCE0]">
            <div className="text-[#5F6368] text-xs font-medium tracking-wide mb-1">{g.label}</div>
            <div className={`text-xl font-medium ${g.value > 0 ? 'text-[#1E8E3E]' : g.value < 0 ? 'text-[#D93025]' : 'text-[#202124]'}`}>
              {g.value > 0 ? '+' : ''}{g.value.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Positions Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-[#5F6368]">Legs</h3>
            <button 
              onClick={addPosition}
              className="flex items-center text-sm font-medium text-[#1A73E8] hover:text-[#174EA6] transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-1" /> Add Leg
            </button>
          </div>
          
          <div className="space-y-3">
            {positions.map(pos => (
              <div key={pos.id} className="bg-white rounded-xl p-3 border border-[#DADCE0] text-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-2">
                    <select 
                      className="bg-white border border-[#DADCE0] rounded-md px-2 py-1 text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                      value={pos.action}
                      onChange={e => updatePosition(pos.id, 'action', e.target.value)}
                    >
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                    <select 
                      className="bg-white border border-[#DADCE0] rounded-md px-2 py-1 text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                      value={pos.quantity}
                      onChange={e => updatePosition(pos.id, 'quantity', parseInt(e.target.value))}
                    >
                      {[1,2,3,4,5,10].map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                    <select 
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00C29A]/50 focus:border-[#00C29A]"
                      value={pos.type}
                      onChange={e => updatePosition(pos.id, 'type', e.target.value)}
                    >
                      <option value="call">Call</option>
                      <option value="put">Put</option>
                    </select>
                  </div>
                  <button onClick={() => removePosition(pos.id)} className="text-[#5F6368] hover:text-[#D93025] transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-[#5F6368] font-medium">Strike</span>
                    <input 
                      type="number" 
                      className="bg-white border border-[#DADCE0] rounded-md px-2 py-1 w-20 text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                      value={pos.strike}
                      onChange={e => updatePosition(pos.id, 'strike', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-[#5F6368] font-medium">Prem.</span>
                    <input 
                      type="number" step="0.01"
                      className="bg-white border border-[#DADCE0] rounded-md px-2 py-1 w-20 text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
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
          <h3 className="text-sm font-medium text-[#5F6368] mb-4">Payoff at Expiration</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F4" vertical={false} />
              <XAxis 
                dataKey="price" 
                stroke="#BDC1C6" 
                tick={{fill: '#5F6368', fontSize: 12, fontWeight: 500}}
                domain={['dataMin', 'dataMax']}
                type="number"
                tickCount={10}
              />
              <YAxis 
                stroke="#BDC1C6" 
                tick={{fill: '#5F6368', fontSize: 12, fontWeight: 500}}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#DADCE0', color: '#202124', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)' }}
                itemStyle={{ color: '#1A73E8', fontWeight: 500 }}
                labelFormatter={(val) => `Underlying Price: $${val}`}
                formatter={(val: any) => typeof val === 'number' ? [`$${val.toFixed(2)}`, 'Profit/Loss'] : ['', 'Profit/Loss']}
              />
              <ReferenceLine y={0} stroke="#BDC1C6" />
              <ReferenceLine x={CURRENT_PRICE} stroke="#BDC1C6" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="pnl" 
                stroke="#1A73E8" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#1A73E8', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
