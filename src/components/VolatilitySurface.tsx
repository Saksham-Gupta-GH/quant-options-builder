'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { generateVolatilitySurface } from '../lib/mock-data';

// Dynamically import Plotly to avoid SSR issues with the window object
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function VolatilitySurface() {
  const [data, setData] = useState<any>(null);
  const [baseIv, setBaseIv] = useState(0.20);
  const [smileSteepness, setSmileSteepness] = useState(2.5);
  const [termSlope, setTermSlope] = useState(0.1);

  useEffect(() => {
    // We import data only on client
    const { strikes, maturities, ivMatrix } = generateVolatilitySurface(baseIv, smileSteepness, termSlope);
    
    setData([
      {
        z: ivMatrix,
        x: strikes,
        y: maturities,
        type: 'surface',
        colorscale: [
          [0, '#e0f2f1'],
          [0.5, '#4db6ac'],
          [1, '#00796b']
        ],
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: '#00e3b4',
            project: { z: true }
          }
        }
      }
    ]);
  }, [baseIv, smileSteepness, termSlope]);

  if (!data) {
    return <div className="h-[400px] flex items-center justify-center text-slate-400">Loading Volatility Surface...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Implied Volatility Surface</h2>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Base IV: {(baseIv * 100).toFixed(0)}%</span>
            <input type="range" min="0.05" max="0.5" step="0.01" value={baseIv} onChange={(e) => setBaseIv(parseFloat(e.target.value))} className="accent-[#00C29A] w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Smile Steepness: {smileSteepness.toFixed(1)}</span>
            <input type="range" min="0.1" max="5.0" step="0.1" value={smileSteepness} onChange={(e) => setSmileSteepness(parseFloat(e.target.value))} className="accent-[#00C29A] w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Term Slope: {termSlope.toFixed(2)}</span>
            <input type="range" min="0.0" max="0.5" step="0.01" value={termSlope} onChange={(e) => setTermSlope(parseFloat(e.target.value))} className="accent-[#00C29A] w-24" />
          </div>
        </div>
      </div>

      <div className="h-[500px] w-full relative">
        <Plot
          data={data}
          layout={{
            autosize: true,
            margin: { l: 0, r: 0, b: 0, t: 0 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            scene: {
              xaxis: { title: { text: 'Strike Price', font: { color: '#475569' } }, color: '#475569', gridcolor: '#e2e8f0' },
              yaxis: { title: { text: 'Days to Expiration', font: { color: '#475569' } }, color: '#475569', gridcolor: '#e2e8f0' },
              zaxis: { title: { text: 'Implied Volatility', font: { color: '#475569' } }, color: '#475569', gridcolor: '#e2e8f0' },
              camera: {
                eye: { x: 1.5, y: 1.5, z: 1.2 }
              }
            },
            font: {
              family: 'Inter, sans-serif',
              color: '#f8fafc'
            }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ displayModeBar: false }}
        />
      </div>
    </div>
  );
}
