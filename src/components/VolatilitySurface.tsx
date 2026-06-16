'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { generateVolatilitySurface } from '../lib/mock-data';

// Dynamically import Plotly to avoid SSR issues with the window object
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function VolatilitySurface() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // We import data only on client
    const { strikes, maturities, ivMatrix } = generateVolatilitySurface();
    
    setData([
      {
        z: ivMatrix,
        x: strikes,
        y: maturities,
        type: 'surface',
        colorscale: 'Viridis',
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: '#42f462',
            project: { z: true }
          }
        }
      }
    ]);
  }, []);

  if (!data) {
    return <div className="h-[400px] flex items-center justify-center text-slate-400">Loading Volatility Surface...</div>;
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl">
      <h2 className="text-2xl font-semibold text-slate-100 mb-6">Implied Volatility Surface</h2>
      <div className="h-[500px] w-full relative">
        <Plot
          data={data}
          layout={{
            autosize: true,
            margin: { l: 0, r: 0, b: 0, t: 0 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            scene: {
              xaxis: { title: { text: 'Strike Price' }, color: '#94a3b8', gridcolor: '#334155' },
              yaxis: { title: { text: 'Days to Expiration' }, color: '#94a3b8', gridcolor: '#334155' },
              zaxis: { title: { text: 'Implied Volatility' }, color: '#94a3b8', gridcolor: '#334155' },
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
