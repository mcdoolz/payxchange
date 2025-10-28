<div align="center">

# 💱 PayXChange

### Historical Currency Conversion Calculator

*Calculate currency conversions using actual historical exchange rates from each payment date*

[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-3.0-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)](https://chakra-ui.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

PayXChange is a powerful React application designed for accurate historical currency conversions based on payment schedules. Whether you're tracking freelance income, analyzing international payments, or reconciling historical financial data, PayXChange provides precise conversions using actual exchange rates from each payment date.

## ✨ Features

- 🌍 **Multi-Currency Support** - Convert between 20 major currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN, BRL, ZAR, NZD, SGD, HKD, SEK, NOK, DKK, KRW, TRY)
- 📈 **Historical Exchange Rates** - Powered by [Frankfurter API](https://www.frankfurter.app/) with accurate rates from 1999 onwards
- ⏱️ **Flexible Payment Frequencies** - Daily, Weekly, Bi-Weekly, Semi-Monthly, Monthly, and Quarterly schedules
- 🎯 **Date-Based Calculations** - Individual conversion for each payment date, not bulk calculations
- ✏️ **Edit & Delete** - Modify or remove payment entries with ease
- 📊 **Smart Totals** - Automatic currency-grouped totals when multiple payments exist
- 📝 **Activity Log** - Real-time tracking of API calls and calculations with collapsible entries
- 💾 **Export Functionality** - Download CSV reports (individual payment logs, full activity log, cumulative report with totals)
- 🔄 **Local Storage** - Automatic persistence of all data in your browser
- 🎨 **Beautiful UI** - Modern, responsive design with color-coded progress indicators
- 🚀 **Fast & Efficient** - Built with Vite for lightning-fast performance

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Modern UI framework with hooks and concurrent features |
| **Vite** | Next-generation build tool with instant HMR |
| **Chakra UI v3** | Component library for beautiful, accessible UI |
| **React Icons** | Comprehensive icon library |
| **date-fns** | Lightweight date manipulation and formatting |
| **Context API** | Global state management without external dependencies |
| **Frankfurter API** | Free historical exchange rate data (no API key needed) |

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/mcdoolz/payxchange.git
cd payxchange
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
```
http://localhost:5173
```

### Build for Production

To create a production-ready build:

```bash
npm run build
```

This will generate optimized files in the `dist/` directory.

### Preview Production Build

To test the production build locally:

```bash
npm run preview
```

The preview server will start at `http://localhost:4173`

### Deployment

The built files in `dist/` can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist` folder or use `netlify deploy`
- **GitHub Pages**: Push the `dist` folder to a `gh-pages` branch
- **AWS S3**: Upload the `dist` folder contents to your S3 bucket
- **Any CDN**: The app is a static site with no backend requirements

## 🚀 Usage

### Quick Start Guide

1. **🌐 Select Currencies**
   - Choose your base currency (what you were paid in)
   - Choose your target currency (what you want to convert to)

2. **➕ Add Payment Entry**
   - Select the start and end date for the payment period
   - Enter the payment amount
   - Choose the payment frequency (Daily, Weekly, Bi-Weekly, Semi-Monthly, Monthly, or Quarterly)
   - Click "Add Payment Entry"

3. **📊 View Conversions**
   - The app automatically calculates conversions for each payment date
   - See real-time progress with color-coded indicators (orange → green)
   - View totals grouped by currency when multiple payments exist

4. **✏️ Edit or Delete**
   - Click the edit icon to modify a payment entry
   - Click the delete icon to remove an entry
   - Use the "Cancel" button to exit edit mode without changes

5. **📈 Monitor Activity**
   - Check the collapsible activity log panel on the right
   - Each payment entry has its own grouped log
   - Export individual payment logs or cumulative reports as CSV

6. **📥 Export Data**
   - Export individual payment logs
   - Export complete activity log
   - Export cumulative report with smart totals by currency

### Visual Progress Indicators

PayXChange uses a color gradient system to show calculation progress:
- 🟠 **Orange** - Starting calculations
- 🟡 **Yellow** - In progress
- 🟢 **Green** - Complete

## ⚙️ How It Works

PayXChange uses a sophisticated date-based conversion approach for maximum accuracy:

```
Payment Entry (Monthly, Jan-Dec 2023, $5000)
    ↓
Generate Payment Dates
    ↓ Jan 1, Feb 1, Mar 1, ..., Dec 1 (12 dates)
    ↓
For Each Date:
    ↓ Fetch historical exchange rate from Frankfurter API
    ↓ Convert: $5000 × rate[date]
    ↓ Log conversion with progress indicator
    ↓
Sum All Conversions
    ↓
Total: €56,250.48 (using actual historical rates)
```

### Why Individual Date Calculations?

Rather than using a single average rate or end-date rate, PayXchange converts each payment separately using the exchange rate that was active on that specific payment date. This provides:

- ✅ **Accuracy** - Reflects real-world exchange rate fluctuations
- ✅ **Transparency** - See the rate used for each payment
- ✅ **Audit Trail** - Complete log of all calculations
- ✅ **Historical Integrity** - Uses actual rates from 1999 onwards

## 📡 API

This project uses the free [Frankfurter API](https://www.frankfurter.app/) for historical exchange rates.

- 🆓 No API key required
- 📅 Historical data from 1999 onwards
- 🌍 20+ currencies supported
- ⚡ Fast and reliable
- 💾 Automatic caching for performance

## 🏗️ Project Structure

```
payxchange/
├── src/
│   ├── components/
│   │   ├── CurrencySelector.jsx   # Currency selection UI
│   │   ├── DateRangePicker.jsx    # Date input with validation
│   │   ├── PaymentForm.jsx        # Payment entry form
│   │   ├── PaymentList.jsx        # Payment table with totals
│   │   └── LogPanel.jsx           # Activity log with exports
│   ├── context/
│   │   └── PaymentContext.jsx     # Global state management
│   ├── services/
│   │   └── exchangeRate.js        # API integration with caching
│   ├── App.jsx                    # Main application layout
│   └── main.jsx                   # Application entry point
├── public/                        # Static assets
└── package.json                   # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request

### Ideas for Contributions

- 🌍 Additional currency support
- 📊 More export formats (Excel, JSON)
- 📱 Mobile responsive improvements
- 🎨 Additional themes
- 📈 Data visualization charts
- 🔔 Rate change notifications

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Made with ❤️ by mcdoolz**

- 📧 **Email**: apouriliaee@gmail.com  
- 🐙 **GitHub**: [@mcdoolz](https://github.com/mcdoolz)
- 🔗 **Repository**: [github.com/mcdoolz/payxchange](https://github.com/mcdoolz/payxchange)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**PayXChange** - *Making currency conversions historically accurate*

</div>
