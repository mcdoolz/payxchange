# Plan

## Objective
Currency conversion calculator for historical pay rate exchanges

## Features
- Multi-line payment entries (date range, amount, frequency)
- Auto-calculate conversions using historical exchange rates
- Default base/target currencies
- Real-time UI updates

## Tech Stack
- React + Vite
- Chakra UI v3 (components)
- React Icons (visual elements)
- date-fns (date manipulation)
- Context API (state mgmt)
- **Frankfurter API (free, historical rates 1999+)**

## Architecture
```
App
├── PaymentProvider (Context)
├── CurrencySelector
├── PaymentForm
└── PaymentList
    └── PaymentItem[]
```

## Data Model
```js
Payment: {
  id, startDate, endDate, amount, frequency, 
  baseCurrency, targetCurrency
}
```
