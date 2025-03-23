# ECOWATCH - Automated PUC Validation and Pollution Monitoring System

[![NextJS](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

## Demo Video
[![Demo Video](https://img.youtube.com/vi/LqPl6y-Ln9U/0.jpg)](https://www.youtube.com/watch?v=LqPl6y-Ln9U)

## Overview

ECOWATCH is a comprehensive web-based application designed to automate the validation of Pollution Under Control (PUC) certificates and monitor pollution levels in real-time. The system combines computer vision, OCR technology, IoT sensors, and data analytics to create an efficient solution for traffic police and environmental policy makers.

## Key Features

- **Automated Number Plate Recognition**: Captures vehicle registration plates using device camera
- **Real-time PUC Verification**: Extracts and validates vehicle PUC status within 5 seconds
- **Pollution Monitoring**: Integrates with IoT devices (MQ-135 sensors via NodeMCU) to track CO₂ levels
- **Geospatial Analysis**: Maps pollution hotspots and PUC compliance rates by region
- **Multi-level Dashboard**:
  - **Police Interface**: For on-field verification and enforcement
  - **Admin Dashboard**: For policy makers with comprehensive analytics
  - **IoT Management**: For sensor configuration and data visualization

## System Architecture

The ECOWATCH system consists of three main components:

1. **Frontend** (This Repository): Next.js web application with responsive interfaces for different user roles
2. **Backend**: RESTful API services for vehicle data processing, OCR, and database operations
3. **IoT System**: NodeMCU with MQ-135 sensors for real-time pollution monitoring

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, Chart.js, Google Maps API
- **Backend**: Node.js, Express.js, MongoDB
- **Cloud**: AWS (EC2, Lambda, S3, API Gateway)
- **DevOps**: NGINX, Docker
- **IoT**: NodeMCU, MQ-135 sensors, ESP8266

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vedarth1/ECOWATCH.git
   cd ECOWATCH
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
ECOWATCH/
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages and API routes
│   ├── api/           # API endpoints
│   ├── admin/         # Admin dashboard
│   ├── police/        # Police interface
│   └── iot/           # IoT configuration
├── public/            # Static assets
├── styles/            # Global styles and TailwindCSS config
├── utils/             # Utility functions
└── lib/               # Shared libraries and data fetching
```

## Routes and Pages

- `/`: Home page with system overview
- `/police/scan`: Camera interface for number plate scanning
- `/police/reports`: Daily reports of scanned vehicles
- `/admin/dashboard`: Analytics dashboard for policy makers
- `/admin/map`: Geospatial analysis of pollution and PUC compliance
- `/iot/setup`: IoT device configuration interface
- `/iot/monitor`: Real-time pollution monitoring dashboard

## Environment Variables

Create a `.env.local` file in the root directory with the following variables: contact on given email

```
vinayrewatkar.257@gmail.com
```

## Contribution Guidelines

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- [Vedarth Ambilkar](https://github.com/Vedarth1) - Repository maintainer and Backend integration
- [Anamika Kumbhare](https://github.com/AnamikaKumbhare) - Frontend developer, api integration
- [Vinay Rewatkar](https://github.com/vinayrewatkar) - Frontend Developer and state management
- [Janhavi Itankar](https://github.com/Janhavii12) - Frontend developer UI/UX
---

Made with ❤️ for a cleaner environment and safer roads
