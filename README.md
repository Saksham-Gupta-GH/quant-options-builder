# Quant Options Builder

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)
![Status](https://img.shields.io/badge/Status-Live-success)

A professional-grade, interactive web application for quantitative options analysis. 

**Live Demo:** [https://quant-options-builder.vercel.app/](https://quant-options-builder.vercel.app/)

## Overview

Quant Options Builder is designed to help traders, quants, and financial engineers visualize and analyze complex options strategies. It bridges the gap between sophisticated quantitative finance models and modern, high-performance web interfaces.

### Key Features
- **Strategy Builder (2D PnL):** Construct multi-leg options strategies (e.g., Iron Condors, Straddles, Spreads) and visualize their Profit/Loss payoff curves at expiration.
- **Black-Scholes Pricing Engine:** Real-time calculation of portfolio "Greeks" (Delta, Gamma, Theta, Vega, Rho) using standard options pricing models.
- **Implied Volatility Surface (3D):** An interactive 3D visualization demonstrating the volatility smile across strike prices and the term structure across times-to-expiration.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Enterprise/Rubrik Theme)
- **Data Visualization:** 
  - `recharts` for 2D PnL payoff charts.
  - `react-plotly.js` for 3D WebGL Volatility Surface rendering.

## Getting Started

To run the application locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Saksham-Gupta-GH/quant-options-builder.git
   ```
2. Navigate to the project directory:
   ```bash
   cd quant-options-builder
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture & Quantitative Models

The application performs options math entirely on the client side for maximum responsiveness.
- **`src/lib/black-scholes.ts`**: Contains the core math utilities, including the Cumulative Normal Distribution (CND) approximations required for the Black-Scholes-Merton model.
- **Mock Data Generation**: The 3D surface utilizes a mock data generator that algorithmically simulates a realistic volatility surface by applying a quadratic function to moneyness (for the smile) and an inverse square root function to time (for the term structure).

## License
MIT
