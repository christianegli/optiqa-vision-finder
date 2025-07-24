import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Eye, Glasses, Sun, Sparkles, MapPin, Clock, Phone } from 'lucide-react';

interface Question {
  type: 'intro' | 'multiple' | 'single' | 'text' | 'slider';
  section: string;
  title?: string;
  subtitle?: string;
  note?: string;
  question?: string;
  options?: string[];
  placeholder?: string;
  sliderLabels?: string[];
  sliderDefault?: number;
}

interface Answers {
  [key: number]: string | string[] | number;
}

interface SectionData {
  title: string;
  insight: string;
}

interface TimeSlot {
  time: string;
  datetime: Date;
  isBooked: boolean;
}

interface BookingSlot {
  id?: string;
  date: string;
  time: string;
  datetime: Date;
}

interface Store {
  name: string;
  distance: string;
  specialty: string;
  phone: string;
  address?: string;
}

const GlassesFinderWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showSectionComplete, setShowSectionComplete] = useState(false);
  const [completedSectionData, setCompletedSectionData] = useState<SectionData | null>(null);
  const [hasBookedExam, setHasBookedExam] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [userZipCode, setUserZipCode] = useState('');

  const questions: Question[] = [
    {
      type: 'intro',
      section: "Let's Get Started",
      title: "Let's match your glasses with your lifestyle",
      subtitle: "Answer a few quick questions to discover which types of glasses actually fit your day-to-day life.",
      note: "(Takes 2 minutes – and you might learn something useful about your vision!)"
    },
    {
      type: 'single',
      section: "Your Current Setup",
      question: "Do you currently wear glasses or lenses?",
      options: ["Yes, I wear glasses", "Yes, I wear both glasses and contact lenses", "No, but I think I need them", "No, and I don't think I need them"]
    },
    {
      type: 'single',
      section: "Your Current Setup",
      question: "How many pairs of glasses do you regularly use?",
      options: ["Just one", "Two", "More than two", "None"]
    },
    {
      type: 'multiple',
      section: "Your Current Setup",
      question: "What do you mostly use your glasses for?",
      options: ["Everyday wear", "Screen/office work", "Driving", "Sports or outdoors", "Reading", "Fashion"]
    },
    {
      type: 'single',
      section: "Your Current Setup",
      question: "Are you happy with your current setup?",
      options: ["Not at all 😕", "Could be better 😐", "Pretty happy 🙂", "Love it 😍"]
    },
    {
      type: 'multiple',
      section: "Your Current Setup",
      question: "Do you prefer specific brands or styles?",
      options: ["Ray-Ban", "Oakley", "Lindberg", "Tom Ford", "I go for comfort over brands", "Not sure / no preference"]
    },
    {
      type: 'single',
      section: "Lens Comfort & Eye Experience",
      question: "Do you think you would benefit from a new pair of glasses/lenses?",
      options: ["Yes, definitely", "Maybe, I'm not sure", "Probably not", "No, I'm satisfied"]
    },
    {
      type: 'single',
      section: "Lens Comfort & Eye Experience",
      question: "Have your lenses been updated in the past 2 years?",
      options: ["Yes", "No", "Not sure"]
    },
    {
      type: 'multiple',
      section: "Lens Comfort & Eye Experience",
      question: "Do you ever experience any of the following?",
      options: ["Headaches", "Tired eyes", "Glare sensitivity", "Eye strain at screen", "None of these"]
    },
    {
      type: 'single',
      section: "Lens Comfort & Eye Experience",
      question: "What type of lenses do you have today?",
      options: ["Single vision", "Progressive (multifocal)", "Not sure"]
    },
    {
      type: 'single',
      section: "Lens Comfort & Eye Experience",
      question: "How many hours per day are you in front of a screen?",
      options: ["<2 hours", "2–4 hours", "5–8 hours", "More than 8 hours"]
    },
    {
      type: 'single',
      section: "Lifestyle & Vision Needs",
      question: "Do you have issues with your current glasses while driving?",
      options: ["No", "Yes", "Yes, but only at night", "I don't drive a lot"]
    },
    {
      type: 'multiple',
      section: "Lifestyle & Vision Needs",
      question: "What do you usually do in your free time?",
      options: ["Exercise or play sports", "Read/watch shows", "Spend time outdoors", "Travel", "Create (music, art, crafts)", "None of these"]
    },
    {
      type: 'single',
      section: "Lifestyle & Vision Needs",
      question: "Do you ever avoid wearing glasses because they get in the way of your activities?",
      options: ["Yes", "Sometimes", "No"]
    },
    {
      type: 'text',
      section: "Lifestyle & Vision Needs",
      question: "Tell us about your specific activities and hobbies",
      placeholder: "e.g., tennis twice a week, coding 8+ hours daily, reading novels, cycling, gaming, cooking, woodworking, etc."
    },
    {
      type: 'single',
      section: "Sun, Style & Self-Expression",
      question: "Do you wear sunglasses with prescription?",
      options: ["Yes", "No, but I'd like to", "No"]
    },
    {
      type: 'slider',
      section: "Sun, Style & Self-Expression",
      question: "What is important for you in glasses?",
      sliderLabels: ["Price", "Style"],
      sliderDefault: 50
    }
  ];

  const downloadResultsAsPDF = () => {
    try {
      // Create HTML content for PDF
      const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6; text-align: center; margin-bottom: 30px;">Your Personalized Vision Plan</h1>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">📊 Your Answers Summary</h2>
            ${Object.entries(answers).map(([key, value]) => {
              const question = questions[parseInt(key)];
              if (!question || !question.question) return '';
              return `<p><strong>${question.question}</strong><br/>${Array.isArray(value) ? value.join(', ') : value}</p>`;
            }).join('')}
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">🧠 AI-Powered Insights</h2>
            <div>${aiInsights.replace(/\n/g, '<br/>')}</div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280;">
            <p>Generated by OptiQa Vision Finder • ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `;

      // Open new window with content
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Your Vision Plan - OptiQa</title></head>
            <body>${content}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      alert('Download failed. Please try again or take a screenshot of your results.');
    }
  };

  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    setLoadingProgress(0);
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Set a timeout to prevent getting stuck
    const timeoutId = setTimeout(() => {
      console.log("AI request timed out, using fallback");
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setTimeout(() => {
        setAiInsights(generatePersonalizedFallback());
        setIsGeneratingInsights(false);
      }, 500);
    }, 8000); // 8 second timeout
    
    try {
      // Check if we have a Gemini API key configured
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        console.log("No Gemini API key configured, using fallback");
        throw new Error("No API key configured");
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert optician with 20+ years of experience. Analyze these questionnaire responses and provide highly specific, personalized eyewear recommendations. DO NOT give generic advice - tailor everything to their exact answers.

User Responses: ${JSON.stringify(answers)}

ANALYSIS FRAMEWORK:
1. Screen Time Analysis: Look at hours per day, eye strain symptoms, work type
2. Activity Analysis: Parse their specific activities text and lifestyle needs  
3. Current Setup Analysis: What they have vs satisfaction level vs needs
4. Vision Type Analysis: Progressive vs single vision impacts recommendations
5. Lifestyle Gaps: What's missing from their current setup

RECOMMENDATION RULES:
- 5+ hours screen time + eye strain = dedicated computer glasses recommended
- Sports activities mentioned = sports glasses (be specific to their sport)
- Progressive lenses + lots of reading = separate reading glasses for comfort
- Driving issues = specialized driving glasses with anti-glare
- Outdoor activities = prescription sunglasses essential
- "Avoid wearing glasses" = contact lens alternative or sports glasses
- Unhappy with current setup = identify specific problems and solutions

MANDATORY: You MUST recommend exactly 3 pairs of glasses. No more, no less. Always 3 pairs.

Structure your response like this:

**Your Vision Analysis:** [2 sentences: their main challenges and lifestyle demands based on actual answers]

**Recommended Eyewear System:** (Exactly 3 glasses required)
• [Primary glasses - be specific about lens type, coatings, frame style for their main need]
• [Secondary glasses - match to their specific secondary activity/need]
• [Third glasses - always provide a third recommendation, could be backup, specialized, or complementary pair]

**Why This Setup:** [Explain how each recommendation solves specific problems they mentioned]

**Activity-Specific Tips:** [Based on their activities text, give 2-3 specific tips for their hobbies/work]

CRITICAL: You must provide exactly 3 glasses recommendations every time. Vary recommendations based on their actual answers. Make it personal and specific. ALWAYS EXACTLY 3 GLASSES.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        })
      });
      
      clearTimeout(timeoutId); // Cancel timeout since we got a response
      
      if (!response.ok) {
        throw new Error(`Gemini API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      setLoadingProgress(100);
      
      setTimeout(() => {
        // Extract text from Gemini response format
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate insights";
        setAiInsights(generatedText);
        setIsGeneratingInsights(false);
      }, 500);
      
    } catch (error) {
      clearTimeout(timeoutId); // Cancel timeout
      console.log("Gemini API call failed, using fallback recommendations:", error);
      setLoadingProgress(100);
      
      setTimeout(() => {
        setAiInsights(generatePersonalizedFallback());
        setIsGeneratingInsights(false);
      }, 1000);
    }
  };

  // Generate personalized fallback based on actual answers
  const generatePersonalizedFallback = () => {
    const screenTime = Object.values(answers).find(a => 
      typeof a === 'string' && (a.includes('8 hours') || a.includes('More than 8'))
    );
    const hasEyeStrain = Object.values(answers).some(a => 
      Array.isArray(a) && a.includes('Eye strain at screen')
    );
    const hasProgressives = Object.values(answers).some(a => 
      typeof a === 'string' && a.includes('Progressive')
    );
    const activitiesText = Object.values(answers).find(a => 
      typeof a === 'string' && a.length > 10 && !a.includes('hours') && !a.includes('Progressive')
    ) as string | undefined;
    
    let analysis = "Based on your responses, you have diverse visual needs throughout your day that would benefit from a strategic multi-glasses approach.";
    let primary = "**Primary:** Daily wear glasses with anti-reflective coating and premium lenses";
    let secondary = "**Secondary:** Prescription sunglasses with UV protection and polarized lenses";
    let third = "**Third:** Backup glasses or specialized computer lenses";

    // Customize based on answers
    if (screenTime && hasEyeStrain) {
      analysis = "Your extensive screen time combined with eye strain symptoms indicates you need specialized solutions for digital comfort and general vision needs.";
      primary = "**Primary:** Computer glasses with blue light filtering and anti-reflective coating - optimized for your extensive screen work";
      third = "**Third:** General-purpose everyday glasses for non-screen activities";
    }

    if (hasProgressives) {
      primary = "**Primary:** Progressive lenses with premium coatings - seamless vision at all distances";
      third = "**Third:** Dedicated reading glasses for extended close-up work and enhanced comfort";
    }

    if (activitiesText && activitiesText.length > 20) {
      if (activitiesText.toLowerCase().includes('sport') || activitiesText.toLowerCase().includes('tennis') || activitiesText.toLowerCase().includes('cycling')) {
        secondary = "**Secondary:** Sport-specific glasses with impact-resistant lenses and secure fit - perfect for your active lifestyle";
      }
      if (activitiesText.toLowerCase().includes('driving') || activitiesText.toLowerCase().includes('night')) {
        third = "**Third:** Specialized driving glasses with anti-glare coating for enhanced night vision safety";
      }
    }

    return `**Your Vision Analysis:** ${analysis} Your questionnaire responses show specific patterns that guide us toward a personalized three-glasses system.\n\n**Recommended Eyewear System:**\n• ${primary}\n• ${secondary}\n• ${third}\n\n**Why This Setup:** This three-glasses approach ensures optimal vision for your specific lifestyle demands. Each pair addresses different visual environments and activities, providing comprehensive coverage for work, leisure, and daily life.\n\n**Activity-Specific Tips:** Keep your most-used glasses easily accessible in your daily routine. Consider lens cleaning kits for each pair to maintain optimal clarity. Schedule regular eye exams to keep prescriptions current and adjust recommendations as your needs evolve.`;
  };

  // Helper function that could be used for generating booking slots if needed
  // const generateTimeSlots = (): BookingSlot[] => {
  //   const slots: BookingSlot[] = [];
  //   const today = new Date();
  //   
  //   // Generate slots for next 7 days
  //   for (let day = 1; day <= 7; day++) {
  //     const date = new Date(today);
  //     date.setDate(today.getDate() + day);
  //     
  //     // Skip weekends
  //     if (date.getDay() === 0 || date.getDay() === 6) continue;
  //     
  //     // Generate hourly slots from 9 AM to 5 PM
  //     for (let hour = 9; hour <= 17; hour++) {
  //       const slotTime = new Date(date);
  //       slotTime.setHours(hour, 0, 0, 0);
  //       
  //       slots.push({
  //         id: `${date.getTime()}-${hour}`,
  //         date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
  //         time: slotTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
  //         datetime: slotTime
  //       });
  //     }
  //   }
  //   
  //   return slots.slice(0, 20); // Show first 20 available slots
  // };

  const bookExamSlot = (slot: BookingSlot) => {
    setSelectedSlot(slot);
    setHasBookedExam(true);
  };

  const renderBookingCalendar = () => {
    // Generate next 14 days (excluding weekends)
    const generateCalendarDays = (): Date[] => {
      const days: Date[] = [];
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow
      
      while (days.length < 10) { // Show next 10 business days
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends
          days.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return days;
    };

    // Generate time slots for selected date
    const generateTimeSlotsForDate = (date: Date): TimeSlot[] => {
      const times: TimeSlot[] = [];
      const startHour = 9;
      const endHour = 17;
      
      for (let hour = startHour; hour <= endHour; hour++) {
        // Skip lunch hour
        if (hour === 13) continue;
        
        const time = new Date(date);
        time.setHours(hour, 0, 0, 0);
        
        // Make some slots "booked" for realism
        const isBooked = Math.random() < 0.3;
        
        times.push({
          time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          datetime: time,
          isBooked
        });
      }
      return times;
    };

    const calendarDays = generateCalendarDays();

    // Handle date selection
    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setAvailableTimes(generateTimeSlotsForDate(date));
    };

    const selectTimeSlot = (time: TimeSlot) => {
      const slot: BookingSlot = {
        date: selectedDate!.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: time.time,
        datetime: time.datetime
      };
      bookExamSlot(slot);
    };
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📅 Book Your Eye Exam</h3>
          <p className="text-gray-600 mb-6">
            Schedule a comprehensive eye exam to get personalized recommendations from our certified opticians.
          </p>
        </div>

        {/* Step 1: Zip Code */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">1. Enter Your Zip Code</h4>
          <div className="max-w-md">
            <input
              type="text"
              value={userZipCode}
              onChange={(e) => setUserZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Enter zip code (e.g., 28001)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              maxLength={5}
            />
            <p className="text-sm text-gray-500 mt-2">We'll find the closest certified opticians in your area</p>
          </div>
        </div>

        {/* Step 2: Date Selection - Only show if zip code is entered */}
        {userZipCode.length >= 5 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">2. Select a Date</h4>
            <div className="grid grid-cols-5 gap-3">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  className={`p-3 border rounded-lg text-center transition-all hover:border-blue-400 ${
                    selectedDate?.toDateString() === day.toDateString()
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs text-gray-500 font-medium">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-semibold">
                    {day.getDate()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Time Selection - Only show if date is selected */}
        {selectedDate && userZipCode.length >= 5 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              3. Choose a Time for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availableTimes.map((timeSlot, index) => (
                <button
                  key={index}
                  onClick={() => selectTimeSlot(timeSlot)}
                  disabled={timeSlot.isBooked}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    timeSlot.isBooked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400'
                  }`}
                >
                  {timeSlot.isBooked ? (
                    <div className="flex flex-col items-center">
                      <span className="text-sm">{timeSlot.time}</span>
                      <span className="text-xs">Booked</span>
                    </div>
                  ) : (
                    timeSlot.time
                  )}
                </button>
              ))}
            </div>
            {availableTimes.filter(t => !t.isBooked).length === 0 && (
              <p className="text-center text-gray-500 mt-4">No available slots for this day. Please select another date.</p>
            )}
          </div>
        )}
        
        <div className="text-center text-sm text-gray-500">
          <p>💡 All exams include comprehensive vision testing and personalized glasses recommendations</p>
        </div>
      </div>
    );
  };

  const renderOpticiansList = () => {
    const mockStores: Store[] = [
      { 
        name: "Optica Nova", 
        distance: "550m", 
        specialty: "Fast service & great progressive lens fittings", 
        phone: "+34 912 345 678",
        address: "Calle Gran Via 45, Madrid"
      },
      { 
        name: "CentroVisión", 
        distance: "1.1km", 
        specialty: "Specialists in sports and sunglasses", 
        phone: "+34 912 345 679",
        address: "Plaza Mayor 12, Madrid"
      },
      { 
        name: "Óptica Bassol", 
        distance: "2.3km", 
        specialty: "Premium frames & lens upgrade support", 
        phone: "+34 912 345 680",
        address: "Paseo de la Castellana 89, Madrid"
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Exam Booked Successfully!</h4>
              <p className="text-sm text-green-700">
                {selectedSlot?.date} at {selectedSlot?.time} in {userZipCode} - Confirmation details sent to your email
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Your Closest Certified Opticians
          </h3>
          <div className="space-y-4">
            {mockStores.map((store, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{store.name}</h4>
                  <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{store.distance}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{store.specialty}</p>
                <p className="text-gray-500 text-xs mb-3">{store.address}</p>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Get Directions
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📍 Store Locations Map</h3>
          <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center border border-gray-300">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-600 mb-2">Interactive Map</h4>
              <p className="text-gray-500 mb-4">Real-time directions and store locations</p>
              <div className="bg-white rounded-lg px-4 py-2 text-sm text-gray-600 border border-gray-300">
                Google Maps integration would appear here
              </div>
            </div>
          </div>
          
          {/* Map Info Bar */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gray-800">Nearby Locations</h5>
              <span className="text-sm text-gray-500">Based on zip code: {userZipCode || 'Not provided'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockStores.map((store, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-red-500' : index === 1 ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{store.name}</div>
                    <div className="text-gray-500 text-xs">{store.distance} away</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const updateAnswer = (questionNum: number, value: string | string[] | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionNum]: value
    }));
  };

  const isAnswered = () => {
    if (currentStep === 0) return true;
    if (currentStep >= questions.length) return true;
    
    const answer = answers[currentStep];
    const question = questions[currentStep];
    
    if (question?.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    
    if (question?.type === 'slider') {
      // For sliders, default to 50 if no answer is set, so it's always considered answered
      return true;
    }
    
    if (question?.type === 'text') {
      // Text fields are always optional - user can skip or provide input
      return true;
    }
    
    return answer !== undefined && answer !== null && answer !== '';
  };

  const getProgress = () => {
    return (currentStep / (questions.length + 1)) * 100;
  };

  const getSectionProgress = () => {
    const sections = [
      { name: "Your Current Setup", start: 1, end: 5 },
      { name: "Lens Comfort & Eye Experience", start: 6, end: 10 },
      { name: "Lifestyle & Vision Needs", start: 11, end: 14 },
      { name: "Sun, Style & Self-Expression", start: 15, end: 16 }
    ];

    return sections.map((section) => {
      let progress = 0;
      if (currentStep < section.start) {
        progress = 0;
      } else if (currentStep > section.end) {
        progress = 100;
      } else {
        const sectionProgress = (currentStep - section.start + 1) / (section.end - section.start + 1);
        progress = sectionProgress * 100;
      }
      
      return {
        ...section,
        progress,
        isActive: currentStep >= section.start && currentStep <= section.end,
        isComplete: currentStep > section.end
      };
    });
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case "Let's Get Started": return "bg-blue-500";
      case "Your Current Setup": return "bg-blue-500";
      case "Lens Comfort & Eye Experience": return "bg-yellow-500";
      case "Lifestyle & Vision Needs": return "bg-green-500";
      case "Sun, Style & Self-Expression": return "bg-red-500";
      default: return "bg-purple-500";
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case "Let's Get Started": return Sparkles;
      case "Your Current Setup": return Glasses;
      case "Lens Comfort & Eye Experience": return Eye;
      case "Lifestyle & Vision Needs": return Clock;
      case "Sun, Style & Self-Expression": return Sun;
      default: return Sparkles;
    }
  };

  const getSectionInsights = (sectionName: string, answers: Answers): SectionData => {
    const insights: { [key: string]: SectionData } = {
      "Your Current Setup": {
        title: "Current Setup Complete!",
        insight: Object.values(answers).some(a => Array.isArray(a) ? a.includes("Yes, I wear glasses") : a === "Yes, I wear glasses") 
          ? "We learned about your current glasses and how you use them daily."
          : "We learned about your vision needs and lifestyle preferences."
      },
      "Lens Comfort & Eye Experience": {
        title: "Vision Analysis Complete!",
        insight: Object.values(answers).some(a => Array.isArray(a) ? a.includes("Eye strain at screen") : a === "Eye strain at screen")
          ? "We identified potential screen-related eye strain to address."
          : "We analyzed your current lens performance and eye comfort."
      },
      "Lifestyle & Vision Needs": {
        title: "Lifestyle Mapped!",
        insight: Object.values(answers).some(a => Array.isArray(a) ? a.includes("Exercise or play sports") : false)
          ? "We see you're active - we'll factor that into your recommendations."
          : "We mapped how you spend your time to match the right glasses."
      },
      "Sun, Style & Self-Expression": {
        title: "Style Preferences Noted!",
        insight: "Perfect! We now have everything needed for your personalized vision plan."
      }
    };
    return insights[sectionName] || { title: "Section Complete!", insight: "Great progress!" };
  };

  const checkSectionCompletion = (newStep: number) => {
    const currentQuestion = questions[newStep - 1];
    const nextQuestion = questions[newStep];
    
    if (!currentQuestion || !nextQuestion) return false;
    
    return currentQuestion.section !== nextQuestion.section;
  };

  const nextStep = async () => {
    const newStep = currentStep + 1;
    
    if (newStep > 1 && newStep < questions.length && checkSectionCompletion(newStep)) {
      const completedSection = questions[currentStep].section;
      const sectionData = getSectionInsights(completedSection, answers);
      
      setCompletedSectionData(sectionData);
      setShowSectionComplete(true);
      
      setTimeout(() => {
        setShowSectionComplete(false);
        setCurrentStep(newStep);
      }, 2500);
      return;
    }
    
    if (currentStep === questions.length - 1) {
      setCurrentStep(newStep);
      setTimeout(() => {
        generateAIInsights();
      }, 100);
    } else {
      setCurrentStep(newStep);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderSectionComplete = () => {
    if (!completedSectionData) return null;
    
    return (
      <div className="text-center space-y-6">
        {/* Animated checkmark circle */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg pulse-once">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">{completedSectionData.title}</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">{completedSectionData.insight}</p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <span className="text-sm font-medium">Moving to next section...</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping animation-delay-300"></div>
        </div>
      </div>
    );
  };

  const renderQuestion = () => {
    if (currentStep >= questions.length) return renderResults();
    
    const q = questions[currentStep];

    // Initialize slider with default value if not already set
    if (q.type === 'slider' && answers[currentStep] === undefined && q.sliderDefault) {
      updateAnswer(currentStep, q.sliderDefault);
    }

    if (q.type === 'intro') {
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Glasses className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{q.title}</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">{q.subtitle}</p>
          <p className="text-sm text-gray-500">{q.note}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">{q.question}</h3>
        
        {q.type === 'slider' ? (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-gray-600 px-2">
              <span>{q.sliderLabels?.[0]} focused</span>
              <span>{q.sliderLabels?.[1]} focused</span>
            </div>
            <div className="relative px-4">
              <input
                type="range"
                min="0"
                max="100"
                value={(answers[currentStep] as number) || q.sliderDefault || 50}
                onChange={(e) => updateAnswer(currentStep, parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(answers[currentStep] as number) || q.sliderDefault || 50}%, #e5e7eb ${(answers[currentStep] as number) || q.sliderDefault || 50}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <div className="text-center text-sm text-gray-500">
              Current preference: {
                ((answers[currentStep] as number) || q.sliderDefault || 50) < 25 ? 'Strongly price focused' : 
                ((answers[currentStep] as number) || q.sliderDefault || 50) < 50 ? 'Somewhat price focused' :
                ((answers[currentStep] as number) || q.sliderDefault || 50) < 75 ? 'Somewhat style focused' : 
                'Strongly style focused'
              }
            </div>
          </div>
        ) : q.type === 'text' ? (
          <div className="space-y-4">
            <textarea
              value={(answers[currentStep] as string) || ''}
              onChange={(e) => updateAnswer(currentStep, e.target.value)}
              placeholder={q.placeholder}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              rows={4}
            />
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-500">
                💡 The more specific you are, the better we can tailor your recommendations!
              </p>
              <button
                onClick={() => updateAnswer(currentStep, 'skipped')}
                className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all font-medium"
              >
                <span>Skip this question</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {q.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  if (q.type === 'multiple') {
                    const current = (answers[currentStep] as string[]) || [];
                    const updated = current.includes(option)
                      ? current.filter(item => item !== option)
                      : [...current, option];
                    updateAnswer(currentStep, updated);
                  } else {
                    updateAnswer(currentStep, option);
                  }
                }}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 ${
                  q.type === 'multiple'
                    ? ((answers[currentStep] as string[]) || []).includes(option)
                      ? 'border-blue-500 bg-blue-100 text-blue-800'
                      : 'border-gray-200 bg-white'
                    : answers[currentStep] === option
                      ? 'border-blue-500 bg-blue-100 text-blue-800'
                      : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {q.type === 'multiple' && (
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      ((answers[currentStep] as string[]) || []).includes(option)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {((answers[currentStep] as string[]) || []).includes(option) && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => {
    if (isGeneratingInsights) {
      return (
        <div className="text-center space-y-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Creating Your Vision Plan</h2>
            <p className="text-lg text-gray-600">Analyzing your responses with Gemini AI to provide personalized recommendations...</p>
          </div>
          
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Generating your personalized insights</span>
              <span>{Math.round(loadingProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">This may take a few moments...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Personalized Vision Plan</h2>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Vision Profile</h3>
              <p className="text-gray-600">Gemini AI-powered analysis based on your lifestyle and vision needs</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="max-w-none">
              <div className="text-gray-700 leading-relaxed space-y-4">
                {aiInsights.split('\n').map((line, index) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;
                  
                  if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                    const headerText = trimmedLine.slice(2, -2);
                    return (
                      <h4 key={index} className="text-lg font-semibold text-gray-800 mb-3 mt-6 first:mt-0">
                        {headerText}
                      </h4>
                    );
                  }
                  
                  if (trimmedLine.startsWith('•')) {
                    // Process markdown bold within bullet points
                    const bulletText = trimmedLine.substring(1).trim();
                    const processedText = bulletText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    
                    return (
                      <div key={index} className="flex items-start space-x-3 mb-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                        <p 
                          className="m-0 text-base leading-relaxed text-gray-700"
                          dangerouslySetInnerHTML={{ __html: processedText }}
                        ></p>
                      </div>
                    );
                  }
                  
                  // Process markdown bold in regular paragraphs
                  const processedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  
                  return (
                    <p 
                      key={index} 
                      className="m-0 text-base leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{ __html: processedLine }}
                    ></p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* PDF Download Button */}
        <div className="text-center">
          <button
            onClick={downloadResultsAsPDF}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-left">
              <div className="text-lg">Download Your Vision Profile Now</div>
              <div className="text-sm opacity-90">Bring it to your eye test!</div>
            </div>
          </button>
        </div>

        {/* Booking Flow or Opticians List */}
        {!hasBookedExam ? renderBookingCalendar() : renderOpticiansList()}

        <div className="text-center text-gray-500 text-sm">
          <p>💡 Tip: Bring your current glasses and this report to your appointment for the best experience!</p>
        </div>
      </div>
    );
  };

  const currentQuestion = questions[currentStep];
  const currentSection = currentStep >= questions.length ? "Your Personalized Results" : currentQuestion?.section;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <style>{`
        @keyframes zoom-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .pulse-once {
          animation: zoom-once 0.8s ease-in-out 1;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          appearance: none;
        }
      `}</style>
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bars - Hidden on start screen */}
        {currentStep > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>Question {Math.min(currentStep + 1, questions.length)} of {questions.length}</span>
              <span>{Math.round(getProgress())}% Complete</span>
            </div>
            
            {currentStep >= questions.length ? (
              <div className="grid grid-cols-4 gap-2">
                {getSectionProgress().map((_, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-xs text-center font-medium text-green-600">100%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {getSectionProgress().map((section, index) => (
                  <div key={index} className="space-y-1">
                    <div className={`text-xs text-center font-medium ${section.isActive ? 'text-blue-600' : section.isComplete ? 'text-green-600' : 'text-gray-400'}`}>
                      {Math.round(section.progress)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          section.isComplete 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : section.isActive 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                              : 'bg-gray-300'
                        }`}
                        style={{ width: `${section.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSectionColor(currentSection || '')}`}>
              {React.createElement(getSectionIcon(currentSection || ''), { className: "w-5 h-5 text-white" })}
            </div>
            <h2 className="text-lg font-semibold text-gray-700">{currentSection}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 min-h-[400px] flex flex-col justify-center">
          {showSectionComplete ? renderSectionComplete() : renderQuestion()}
        </div>

        {!showSectionComplete && (
          <div className="flex justify-between items-center">
            {currentStep === 0 ? (
              <div className="w-full flex justify-center">
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all text-lg"
                >
                  <span>Let's Get Started</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                {currentStep < questions.length && (
                  <button
                    onClick={nextStep}
                    disabled={!isAnswered()}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      isAnswered()
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{currentStep === questions.length - 1 ? 'Get My Results' : 'Next'}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassesFinderWizard; 
