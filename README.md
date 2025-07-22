# OptiQa Vision Finder

An intelligent glasses recommendation system that helps users discover the perfect eyewear for their lifestyle through an interactive questionnaire and AI-powered analysis.

## 🚀 Features

- **Interactive Questionnaire**: Multi-section wizard collecting lifestyle, vision needs, and preferences
- **AI-Powered Insights**: Personalized recommendations using Google Gemini AI (with intelligent fallbacks)
- **Smart Booking System**: Integrated calendar for scheduling eye exams
- **Store Locator**: Find nearby opticians with maps integration
- **PDF Export**: Download personalized vision profiles
- **Modern UI**: Beautiful, responsive design with animations and progress tracking

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd glasses-finder-wizard
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

## 🤖 AI Integration (Optional)

The app works perfectly without an API key using intelligent fallback logic. For enhanced AI insights:

### Getting a Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a Google account if needed and generate an API key
3. Create a `.env` file in the project root:
   ```bash
   # Optional: Enhanced AI insights with Gemini
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

### How It Works

- **With API Key**: Advanced personalized recommendations using Google Gemini AI
- **Without API Key**: Smart fallback system provides intelligent recommendations based on user responses
- **Fallback Logic**: Analyzes screen time, activities, current setup, and vision needs to generate personalized advice

## 🏗️ Project Structure

```
glasses-finder-wizard/
├── src/
│   ├── needs_analysis.tsx    # Main questionnaire component
│   ├── App.tsx              # Application root
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   ├── SETUP.md            # Detailed setup guide
│   └── CONTRIBUTING.md     # Development guidelines
├── ARCHITECTURE.md         # System architecture
├── DECISIONS.md           # Architecture decisions
└── README.md              # This file
```

## 📋 Usage

1. **Start the Questionnaire**: Click "Let's Get Started" to begin
2. **Answer Questions**: Complete 4 sections covering:
   - Your Current Setup
   - Lens Comfort & Eye Experience  
   - Lifestyle & Vision Needs
   - Sun, Style & Self-Expression
3. **Get Recommendations**: Receive personalized glasses recommendations
4. **Book an Exam**: Schedule with nearby certified opticians
5. **Download Results**: Export your vision profile as PDF

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Components

- **GlassesFinderWizard**: Main questionnaire component with state management
- **AI Insights**: Google Gemini integration with fallback recommendations
- **Booking System**: Calendar interface for appointment scheduling
- **Store Locator**: Optician finder with mock data (ready for Google Maps)

## 🎯 How AI Recommendations Work

### Analysis Framework
1. **Screen Time Analysis**: Hours per day, eye strain symptoms
2. **Activity Analysis**: Specific hobbies and lifestyle needs
3. **Current Setup Evaluation**: Satisfaction vs. requirements
4. **Vision Type Assessment**: Progressive vs. single vision impacts
5. **Lifestyle Gap Identification**: Missing elements in current setup

### Recommendation Logic
- 5+ hours screen time + eye strain → Computer glasses recommended  
- Sports activities → Sport-specific glasses with impact resistance
- Progressive lenses + reading → Dedicated reading glasses
- Driving issues → Anti-glare specialized lenses
- Outdoor activities → Prescription sunglasses essential

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](#) (Add when deployed)
- [API Documentation](docs/API.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

## 💡 Notes

- The application is designed to work offline-first with intelligent fallbacks
- All user data is processed client-side for privacy
- Real Google Maps integration requires additional API setup
- Store locations are currently mock data for demonstration

---

Built with ❤️ using React, TypeScript, Vite, and Google Gemini AI
