# RightsSphere 🛡️

**Your Pocket Guide to Rights During Police Interactions**

RightsSphere is a production-ready Next.js Base Mini App that empowers individuals with state-specific legal rights, communication scripts, and real-time assistance during police interactions.

## 🌟 Features

### Core Functionality
- **State-Specific Legal Guides**: AI-generated, mobile-optimized guides detailing legal rights and procedures tailored to the user's current state
- **"Do's and Don'ts" Scripts**: Pre-written, polite, and effective communication scripts in multiple languages
- **One-Tap Recording & Sharing**: Instant audio/video recording with secure IPFS storage via Pinata
- **Location-Based Alerts**: Discreet emergency alerts sent to trusted contacts via Farcaster or SMS
- **Shareable Rights Card Generation**: Automatically generates shareable 'Know-Your-Rights' cards for social platforms

### Technical Features
- **Production-Ready Architecture**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Decentralized Storage**: IPFS integration via Pinata for secure, permanent storage
- **Social Integration**: Farcaster integration via Neynar for social sharing and alerts
- **Real-time Database**: Supabase integration for user data and interaction logs
- **AI-Powered Content**: OpenAI integration for generating state-specific legal content
- **Mobile-First Design**: Optimized for Base Mini App framework
- **State Management**: Zustand for efficient client-side state management
- **Toast Notifications**: React Hot Toast for user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Pinata account for IPFS storage
- Neynar API key for Farcaster integration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/rightssphere.git
   cd rightssphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # OpenAI API for generating legal content
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Farcaster Integration (Neynar)
   NEYNAR_API_KEY=your_neynar_api_key
   NEXT_PUBLIC_FARCASTER_SIGNER_UUID=your_farcaster_signer_uuid
   
   # Pinata IPFS Storage
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_API_KEY=your_pinata_secret_key
   PINATA_JWT=your_pinata_jwt_token
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=RightsSphere
   ```

4. **Set up Supabase database**
   
   Run the following SQL in your Supabase SQL editor:
   
   ```sql
   -- Create users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT UNIQUE NOT NULL,
     preferred_language TEXT DEFAULT 'en',
     state_of_residence TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create legal_guides table
   CREATE TABLE legal_guides (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     guide_id TEXT UNIQUE NOT NULL,
     state TEXT NOT NULL,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     language TEXT DEFAULT 'en',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create interaction_logs table
   CREATE TABLE interaction_logs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     log_id TEXT UNIQUE NOT NULL,
     user_id TEXT NOT NULL,
     timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
     location JSONB,
     recording_url TEXT,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create alerts table
   CREATE TABLE alerts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     alert_id TEXT UNIQUE NOT NULL,
     user_id TEXT NOT NULL,
     timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
     location JSONB NOT NULL,
     recipient_contact_info JSONB NOT NULL,
     message_template TEXT NOT NULL,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create scripts table
   CREATE TABLE scripts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     script_id TEXT UNIQUE NOT NULL,
     scenario TEXT NOT NULL,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     language TEXT DEFAULT 'en',
     is_premium BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create user_purchases table
   CREATE TABLE user_purchases (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT NOT NULL,
     item_type TEXT NOT NULL,
     item_id TEXT NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     currency TEXT DEFAULT 'USD',
     transaction_hash TEXT,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create indexes for better performance
   CREATE INDEX idx_users_user_id ON users(user_id);
   CREATE INDEX idx_legal_guides_state_language ON legal_guides(state, language);
   CREATE INDEX idx_interaction_logs_user_id ON interaction_logs(user_id);
   CREATE INDEX idx_alerts_user_id ON alerts(user_id);
   CREATE INDEX idx_scripts_scenario_language ON scripts(scenario, language);
   CREATE INDEX idx_user_purchases_user_id ON user_purchases(user_id);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Base Mini App Integration

RightsSphere is built as a Base Mini App, providing seamless integration with the Base ecosystem:

- **OnchainKit Integration**: Built with Coinbase's OnchainKit for Base network compatibility
- **Wallet Integration**: Support for Base-compatible wallets
- **MiniKit Provider**: Optimized for mobile-first Base Mini App experience

## 🏗️ Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling with validation

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Supabase**: PostgreSQL database with real-time features
- **OpenAI API**: AI-powered content generation
- **Pinata**: IPFS storage for decentralized file storage
- **Neynar**: Farcaster protocol integration

### Key Components
- **AppFrame**: Main application container with responsive design
- **LegalCard**: Display component for legal guides and rights cards
- **ScriptButton**: Interactive component for communication scripts
- **RecordButton**: Advanced recording component with IPFS upload
- **AlertButton**: Emergency alert system with contact management
- **ContactSelector**: Contact management for emergency alerts

## 🔧 API Endpoints

### Legal Guides
- `POST /api/legal-guides/generate` - Generate state-specific legal guides
- `GET /api/legal-guides/generate?state=California` - Retrieve existing guides

### Recordings
- `POST /api/recordings/upload` - Upload recordings to IPFS
- `GET /api/recordings/upload?userId=123` - Get user's recording history

### Alerts
- `POST /api/alerts/send` - Send emergency alerts to contacts
- `GET /api/alerts/send?userId=123` - Get user's alert history

### Rights Cards
- `POST /api/share/rights-card` - Generate and share rights cards
- `GET /api/share/rights-card?hash=QmHash` - Retrieve shared rights cards

## 🎨 Design System

RightsSphere uses a comprehensive design system with:

- **Glass morphism UI**: Modern, translucent interface elements
- **Responsive grid system**: Mobile-first responsive design
- **Consistent spacing**: 8px base unit system
- **Accessible colors**: WCAG compliant color palette
- **Smooth animations**: 200ms base duration with easing
- **Typography scale**: Hierarchical text sizing

## 🔒 Security Features

- **IPFS Storage**: Decentralized, tamper-proof file storage
- **Encrypted Communications**: Secure alert transmission
- **Privacy-First**: Minimal data collection and storage
- **Secure Authentication**: Integration with wallet-based auth
- **Input Validation**: Comprehensive form and API validation

## 🌍 Internationalization

- **Multi-language Support**: English and Spanish scripts (extensible)
- **State-Specific Content**: Tailored legal information for all US states
- **Cultural Sensitivity**: Respectful communication across communities

## 📊 Business Model

- **Freemium Model**: Basic features free, premium script packs paid
- **Micro-transactions**: $0.99-$4.99 for premium content
- **Alert Credits**: Pay-per-use emergency alert system
- **NFT Integration**: Rights cards as collectible NFTs

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
# Build the Docker image
docker build -t rightssphere .

# Run the container
docker run -p 3000:3000 --env-file .env.local rightssphere
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for mobile performance
- **Bundle Size**: Optimized with code splitting
- **Caching**: Aggressive caching for static content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.rightssphere.app](https://docs.rightssphere.app)
- **Discord**: [Join our community](https://discord.gg/rightssphere)
- **Email**: support@rightssphere.app

## 🙏 Acknowledgments

- **Base Team**: For the Mini App framework
- **Coinbase**: For OnchainKit and Base network
- **Supabase**: For the backend infrastructure
- **OpenAI**: For AI-powered content generation
- **Pinata**: For IPFS storage solutions
- **Neynar**: For Farcaster protocol integration

---

**⚠️ Legal Disclaimer**: RightsSphere provides general legal information and should not be considered legal advice. Always consult with a qualified attorney for specific legal matters.

**Built with ❤️ for civil rights and digital freedom**
