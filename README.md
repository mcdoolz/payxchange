# PayXChange

A React application for calculating historical currency conversions based on payment schedules. Enter your payment data with date ranges and frequencies, and PayXChange will calculate the total converted amount using actual historical exchange rates from each payment date.

## Features

- **Multi-Currency Support**: Convert between 20 major currencies (USD, EUR, GBP, JPY, CAD, AUD, and more)
- **Historical Exchange Rates**: Uses the [Frankfurter API](https://www.frankfurter.app/) to fetch accurate historical exchange rates from 1999 onwards
- **Flexible Payment Frequencies**: Support for Daily, Weekly, Bi-Weekly, Monthly, Quarterly, and Annually payment schedules
- **Date-Based Calculations**: Calculates conversions for each individual payment date rather than bulk conversion
- **Edit & Delete**: Edit existing payment entries or remove them with ease
- **Activity Log**: Real-time log of API calls and calculations for transparency
- **Local Storage**: Automatically saves your data in the browser
- **Responsive Design**: Full-width layout optimized for desktop use

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Chakra UI v3** - Component library for beautiful UI
- **React Icons** - Icon library
- **date-fns** - Date manipulation and formatting
- **react-day-picker** - Calendar date picker with year/month dropdowns
- **Context API** - Global state management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mcdoolz/payxchange.git
cd payxchange
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Usage

1. **Select Currencies**: Choose your base currency (what you were paid in) and target currency (what you want to convert to)

2. **Add Payment Entry**:
   - Select the date range for the payment period
   - Enter the payment amount
   - Choose the payment frequency
   - Click "Add Payment Entry"

3. **View Conversions**: The app will automatically calculate the total converted amount by:
   - Generating individual payment dates based on the frequency
   - Fetching the historical exchange rate for each date
   - Converting each payment separately
   - Summing all converted amounts

4. **Edit Entries**: Click the edit icon to modify a payment entry

5. **Monitor Activity**: Check the activity log panel on the right to see all API calls and calculations

## How It Works

PayXChange uses a date-based conversion approach:

1. For each payment entry, it generates all payment dates based on the frequency (e.g., monthly from Jan 1 to Dec 31 = 12 dates)
2. For each payment date, it fetches the historical exchange rate from the Frankfurter API
3. It converts the payment amount using that date's specific rate
4. All converted amounts are summed to give the total

This ensures accuracy by using the actual exchange rate that would have been in effect on each payment date.

## API

This project uses the free [Frankfurter API](https://www.frankfurter.app/) for historical exchange rates. No API key required.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Developer

**Email**: apouriliaee@gmail.com  
**Repository**: [github.com/mcdoolz/payxchange](https://github.com/mcdoolz/payxchange)
