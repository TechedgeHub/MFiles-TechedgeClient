# M-Files Object Creator

A simplified web interface for creating M-Files objects without the complexity of the full M-Files client.

## Overview

Streamlined web application that connects to M-Files vaults, allowing users to create objects (Students, Cars, Staff) through an intuitive interface. Eliminates the M-Files client learning curve while maintaining full system integration.

## Key Features

- **Simplified Interface** - Clean, user-friendly design
- **Dynamic Forms** - Auto-generating forms based on M-Files classes
- **Smart Validation** - Real-time validation with helpful errors
- **Lookup Support** - Single and multi-select dropdown fields
- **Responsive Design** - Works on desktop, tablet, and mobile
- **File Upload** - Support for document objects

## Tech Stack

- React 18 + Vite
- Tailwind CSS + shadcn/ui
- React Router DOM
- M-Files API Integration

## Quick Start

```bash
# Clone repository
git clone https://github.com/TechedgeHub/MFiles-TechedgeClient.git
cd techedge

# Install dependencies
npm install

# Set environment variables
echo "VITE_API_BASE_URL=https://your-mfiles-api-url.com" > .env

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

## Usage

1. **Select Object Type** - Choose Student, Car, Staff, etc.
2. **Choose Class** - Pick the appropriate object class
3. **Fill Form** - Complete required and optional fields
4. **Submit** - Create object in M-Files vault

## API Endpoints

The application requires these M-Files API endpoints:

```
GET  /api/MfilesObjects/GetVaultsObjectsTypes
GET  /api/MfilesObjects/GetObjectClasses/{objectId}
GET  /api/MfilesObjects/ClassProps/{objectTypeId}/{classId}
POST /api/objectinstance/ObjectCreation
GET  /api/ValuelistInstance/{propertyId}
POST /api/objectinstance/FilesUploadAsync
```

##  Supported Objects

- **Students** - Admission records and details
- **Cars** - Vehicle registration and management
- **Staff** - Employee records and information
- **Documents** - File-based objects with metadata

## Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting platform
```

Works with Netlify, Vercel, AWS S3, or any static hosting service.

##  Browser Support

Chrome 90+ | Firefox 88+ | Safari 14+ | Edge 90+

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

##  Support

- **Technical Support**: raise issue
- **Documentation**: Built-in `/help` page

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built by Elaine Yvette @ Techedge Africa**  
*Powered by Techedge & M-Files*
