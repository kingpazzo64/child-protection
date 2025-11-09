# Project Overview

## Child Protection Services Directory

A comprehensive platform for managing and accessing child protection services across Rwanda.

---

## 📖 What is this project?

The Child Protection Services Directory is a web-based platform designed to centralize and streamline access to child protection services in Rwanda. It serves as a bridge between service providers and those seeking assistance for children in need.

### Problem Statement

- Child protection services are fragmented across Rwanda
- Difficulty finding appropriate services based on location and needs
- No centralized database of service providers
- Time-consuming process to locate and contact organizations
- Limited visibility for community-based organizations

### Solution

This platform provides:
- **Centralized Directory**: Single source of truth for all child protection services
- **Advanced Search**: Find services by location, type, and beneficiary category
- **Easy Access**: Public-facing interface for anyone to search services
- **Management Tools**: Admin dashboard for maintaining up-to-date information
- **Accountability**: Track service providers and their offerings

---

## 🎯 Key Features

### For the Public

1. **Search Services**
   - Search by organization name
   - Filter by location (District → Sector → Cell → Village)
   - Filter by service type (Counseling, Medical, Legal, etc.)
   - Filter by beneficiary type (Age groups, special needs)

2. **View Details**
   - Organization information
   - Contact details (email, phone, website)
   - Services offered
   - Locations served
   - Free vs. paid services

3. **Easy Navigation**
   - Mobile-friendly design
   - Intuitive interface
   - Interactive chat widget
   - Responsive search

### For Administrators

1. **User Management**
   - Invite new users (email invitations)
   - Manage user roles (Admin, Enumerator)
   - Activate/deactivate accounts
   - Resend activation emails

2. **Directory Management**
   - Add new service providers
   - Edit existing entries
   - Delete outdated entries
   - View all directories

3. **System Configuration**
   - Manage service types
   - Manage beneficiary types
   - View system statistics
   - Access logs

### For Enumerators

1. **Data Entry**
   - Add service providers
   - Update own entries
   - Manage assigned directories

2. **Dashboard Access**
   - View personal statistics
   - Access to data entry tools

---

## 🏗️ Technical Overview

### Architecture

**Type**: Full-stack web application  
**Pattern**: Monolithic with API layer  
**Deployment**: Can be deployed serverless or traditional server

**Stack:**
```
Frontend: React (Next.js) + TypeScript + Tailwind CSS
Backend: Next.js API Routes + Express.js
Database: PostgreSQL + Prisma ORM
Auth: NextAuth.js (JWT-based)
Email: Nodemailer (SMTP)
```

### Project Structure

```
child-protection/
├── app/                      # Next.js App Router
│   ├── api/                 # Backend API routes
│   ├── dashboard/           # Protected admin area
│   ├── login/              # Authentication
│   └── page.tsx            # Public homepage
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   └── [various]           # Feature components
├── lib/                     # Utilities & services
│   ├── auth.ts             # Authentication config
│   ├── prisma.ts           # Database client
│   └── mailer.ts           # Email service
├── prisma/                  # Database
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration history
│   └── seed.cjs            # Seed script
├── docs/                    # Documentation
│   ├── API.md              # API reference
│   ├── SETUP.md            # Setup guide
│   ├── DEPLOYMENT.md       # Deployment guide
│   ├── DATABASE.md         # Database docs
│   ├── ARCHITECTURE.md     # Architecture docs
│   └── CONTRIBUTING.md     # Contribution guide
└── [config files]          # Various config files
```

---

## 👥 User Roles

### Public Users (No Login Required)
- Search and browse services
- View service details
- Access contact information
- No data modification

### Enumerator (Login Required)
- All public user capabilities
- Add new service providers
- Edit own directory entries
- View personal dashboard
- Cannot manage users

### Admin (Login Required)
- All enumerator capabilities
- Full user management
- Edit any directory entry
- Delete entries
- Manage system configuration
- View all statistics
- Invite new users

---

## 📊 Data Model

### Core Entities

**User**
- Represents system users
- Fields: name, email, phone, ID number, role, password
- Roles: ADMIN, ENUMERATOR

**Directory**
- Represents service providers
- Fields: organization name, category, contact info, services, locations
- Categories: Government, NGO, Community-based

**ServiceType**
- Categories of services
- Examples: Counseling, Medical Care, Legal Support, Education

**BeneficiaryType**
- Target beneficiary groups
- Examples: Children 0-5, Adolescents, Orphans, Street Children

**Location Hierarchy**
- District (30 total)
- Sector (416 total)
- Cell (2,148 total)
- Village (14,837 total)

### Relationships

- User **creates** Directory (One-to-Many)
- Directory **offers** ServiceTypes (Many-to-Many)
- Directory **serves** BeneficiaryTypes (Many-to-Many)
- Directory **operates in** Locations (One-to-Many)

---

## 🔒 Security

### Authentication
- Email/password-based login
- JWT tokens for session management
- Bcrypt password hashing
- Email verification required
- Account activation via email link

### Authorization
- Role-based access control (RBAC)
- Middleware-protected routes
- API endpoint authorization
- User action auditing (creator tracking)

### Data Protection
- Environment variables for secrets
- Secure HTTP-only cookies
- SQL injection protection (Prisma)
- XSS protection (React)
- HTTPS in production

---

## 🚀 Getting Started

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd child-protection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

4. **Set up database**
   ```bash
   # Create PostgreSQL database
   # Then run:
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

---

## 📚 Documentation

### For Developers

- **[Setup Guide](./SETUP.md)**: Get up and running quickly
- **[API Documentation](./API.md)**: Complete API reference
- **[Database Documentation](./DATABASE.md)**: Schema and queries
- **[Architecture Documentation](./ARCHITECTURE.md)**: System design
- **[Contributing Guide](./CONTRIBUTING.md)**: How to contribute

### For Deployment

- **[Deployment Guide](./DEPLOYMENT.md)**: Production deployment instructions

### Additional

- **[Changelog](../CHANGELOG.md)**: Version history
- **[README](../README.md)**: Main documentation

---

## 🛠️ Development Workflow

### Local Development

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Database commands
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate Prisma client
```

### Making Changes

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with descriptive message
5. Push and create pull request

### Code Style

- TypeScript for all code
- Functional React components
- Tailwind CSS for styling
- ESLint for code quality
- Conventional commits

---

## 🌍 Deployment Options

### Easy (Recommended for beginners)
- **Vercel**: One-click deployment, free tier
- **Railway**: Includes database, simple setup

### Moderate
- **DigitalOcean**: Traditional VPS
- **Heroku**: Platform-as-a-Service

### Advanced
- **AWS**: EC2, RDS, full control
- **Docker**: Containerized deployment
- **Kubernetes**: Orchestrated deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 📈 Current Status

**Version**: 0.1.0 (Initial Release)  
**Status**: Production-ready  
**Last Updated**: October 28, 2025

### What's Working
✅ User authentication and authorization  
✅ Directory management (CRUD)  
✅ Advanced search and filtering  
✅ Email notifications  
✅ Responsive design  
✅ Location hierarchy  
✅ Admin dashboard  

### Planned Features
🔲 Advanced analytics  
🔲 Export functionality (PDF, Excel)  
🔲 Multi-language support  
🔲 Mobile app  
🔲 File uploads  
🔲 Reviews and ratings  
🔲 API rate limiting  

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. **Code**: Fix bugs, add features
2. **Documentation**: Improve or expand docs
3. **Testing**: Write tests, report bugs
4. **Design**: UI/UX improvements
5. **Translation**: Add language support

### Getting Started

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Find an issue or create one
3. Fork the repository
4. Make your changes
5. Submit a pull request

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help create a positive environment

---

## 📞 Support & Contact

### Getting Help

- **Documentation**: Check the docs folder
- **Issues**: Open a GitHub issue
- **Email**: [Contact information]

### Reporting Bugs

1. Check existing issues
2. Provide detailed description
3. Include steps to reproduce
4. Share error messages/screenshots

### Suggesting Features

1. Check roadmap and existing suggestions
2. Explain the use case
3. Describe expected behavior
4. Provide examples or mockups

---

## 📄 License

This project is proprietary. All rights reserved.

For licensing inquiries, please contact the project maintainers.

---

## 🙏 Acknowledgments

### Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [PostgreSQL](https://www.postgresql.org/) - Database

### Contributors

- Development Team
- [List contributors here]

### Special Thanks

- All contributors and testers
- The open-source community
- Rwanda child protection organizations

---

## 🗺️ Roadmap

### Version 0.2.0 (Next Release)
- Advanced filtering options
- Export functionality
- Enhanced analytics
- Performance optimizations

### Version 0.3.0
- Multi-language support (Kinyarwanda, French)
- Mobile app (React Native)
- Advanced reporting

### Version 1.0.0
- Full feature set
- Production-hardened
- Comprehensive documentation
- API v1 stabilization

### Long-term
- Machine learning recommendations
- Integration with other systems
- Offline support
- Real-time collaboration

---

## 📊 Project Statistics

**Lines of Code**: ~20,000+  
**Components**: 50+  
**API Endpoints**: 25+  
**Database Tables**: 11  
**Locations**: 17,400+ (Districts, Sectors, Cells, Villages)

---

## 🎓 Learning Resources

### For New Developers

**Learn Next.js**:
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)

**Learn Prisma**:
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Guides](https://www.prisma.io/docs/guides)

**Learn TypeScript**:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

**Learn React**:
- [React Documentation](https://react.dev/)
- [React Tutorial](https://react.dev/learn)

### For This Project

1. Start with [SETUP.md](./SETUP.md)
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Review [API.md](./API.md)
4. Check [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## ❓ FAQ

**Q: Who can use this application?**  
A: Anyone can search services. Only registered users can manage data.

**Q: Is this open source?**  
A: No, this is a proprietary project. Check the license for details.

**Q: Can I deploy this for my organization?**  
A: Please contact the project maintainers for licensing.

**Q: How do I report a bug?**  
A: Open an issue on GitHub with details and reproduction steps.

**Q: How can I contribute?**  
A: Read the [Contributing Guide](./CONTRIBUTING.md) to get started.

**Q: What databases are supported?**  
A: Currently only PostgreSQL. MySQL support may be added later.

**Q: Can I use this in production?**  
A: Yes, version 0.1.0 is production-ready.

**Q: Is there a mobile app?**  
A: Not yet, but it's planned for a future release.

---

## 📝 Notes

This project is actively maintained and regularly updated. Check the [CHANGELOG](../CHANGELOG.md) for recent changes and the GitHub repository for the latest updates.

For detailed technical information, refer to the specific documentation files in the `docs/` directory.

---

**Last Updated**: October 28, 2025  
**Documentation Version**: 1.0  
**Project Version**: 0.1.0

---

**Happy Coding! 🚀**


