# Sunrise Assets Dashboard 🌅

A premium, interactive data dashboard built to track and visualize the performance of Canonical Assets deployed through the Sunrise protocol on Solana. 

This dashboard aggregates data from multiple sources (Dune Analytics, CoinGecko) to provide deep, real-time insights into asset growth, trading dynamics, and ecosystem adoption.

---

## 📸 Dashboard Previews

> **Note:** Replace these placeholders with actual screenshots of your running application.

### Market Cap & Daily Change
![Market Cap Dashboard Screenshot](docs/images/market-cap-demo.png)
*Tracking aggregated market cap growth alongside daily percentage changes using a dual-axis composed chart.*

### Buy vs Sell Volume
![Buy vs Sell Screenshot](docs/images/buy-sell-demo.png)
*Visualizing net-new buy volume versus sell volume using a custom bidirectional logarithmic scale.*

### DEX vs CEX Trading Volume
![Trading Volume Screenshot](docs/images/trading-volume-demo.png)
*Comparing trading volume across Decentralized and Centralized exchanges.*

### Holder Growth
![Holders Screenshot](docs/images/holders-demo.png)
*Tracking user adoption and new holder growth over time.*

---

## 🎯 Key Metrics Tracked

1. **Overall Volume & Market Cap**
   - Tracks the aggregated market capitalization of all Sunrise-deployed assets (e.g., MON, HYPE, INX, LIT).
   - Features a custom ComposedChart overlaying total market cap curves against day-over-day positive/negative change bars.

2. **Buy vs Sell Volume**
   - Specifically tracks net-new buy volume (when any external asset like USDC/SOL/Memecoin is swapped *into* a Sunrise asset) versus sell volume (when a Sunrise asset is swapped out).
   - Utilizes advanced charting techniques to display massive outliers alongside average days without squashing the visual scale.

3. **DEX vs CEX Trading Volume**
   - Compares trading activity occurring on-chain (Decentralized Exchanges) against off-chain venues (Centralized Exchanges).
   - Calculates and visualizes the CEX:DEX ratio to highlight where liquidity and trading interest are concentrated.

4. **New Holders**
   - Monitors the growth of unique wallets holding Sunrise assets over time, providing a clear picture of ecosystem adoption.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** Custom Vanilla CSS with a focus on premium, dark-mode Glassmorphism aesthetics.
- **Charts:** [Recharts](https://recharts.org/) for highly interactive and responsive data visualizations.
- **Database:** [MongoDB](https://www.mongodb.com/) for storing and serving aggregated, historical asset data.
- **Data Integrations:** Custom serverless API routes fetching and normalizing data from [Dune Analytics](https://dune.com/) (on-chain DEX data) and [CoinGecko](https://www.coingecko.com/) (CEX pricing/volume).

---

## 🛠️ Getting Started

First, make sure you have your environment variables set up correctly. Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
DUNE_API_KEY=your_dune_analytics_api_key
```

Then, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the complete dashboard.

---

## 🔄 Data Synchronization

The dashboard features a dedicated **Admin Interface** (`/admin`) that allows authorized users to manually trigger data synchronization pipelines. These pipelines fetch the latest block data from Dune Analytics and the latest market data from CoinGecko, normalize it, and securely index it within the MongoDB database for instantaneous frontend retrieval.
