// US States for legal guide generation
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

// Common interaction scenarios
export const INTERACTION_SCENARIOS = [
  { id: 'traffic_stop', title: 'Traffic Stop', icon: '🚗' },
  { id: 'search', title: 'Search Request', icon: '🔍' },
  { id: 'arrest', title: 'Arrest Situation', icon: '⚖️' },
  { id: 'general', title: 'General Interaction', icon: '👮' },
];

// Emergency contacts template
export const EMERGENCY_MESSAGE_TEMPLATE = 
  "🚨 ALERT: I'm currently in a police interaction at {location}. Time: {timestamp}. Please monitor this situation. - Sent via RightsSphere";

// Sample legal guides for demonstration
export const SAMPLE_LEGAL_GUIDES = {
  'California': {
    title: 'California Rights During Police Interactions',
    content: `
**Your Rights in California:**

1. **Right to Remain Silent**: You have the right to remain silent and not answer questions beyond providing identification during a traffic stop.

2. **Search Rights**: Police need a warrant, your consent, or probable cause to search you or your property.

3. **Recording Rights**: You have the right to record police interactions in public spaces.

4. **Identification**: During a traffic stop, you must provide your driver's license. As a passenger, you're not required to show ID unless arrested.

5. **Immigration**: You have the right to remain silent about your immigration status.

**Important Notes:**
- Stay calm and keep your hands visible
- Don't resist, even if you believe the stop is unfair
- Ask "Am I free to leave?" if unsure about detention
- Request a lawyer if arrested
    `
  },
  'New York': {
    title: 'New York Rights During Police Interactions',
    content: `
**Your Rights in New York:**

1. **Stop and Frisk**: Police can stop you if they have reasonable suspicion, but can only frisk for weapons if they fear for safety.

2. **Right to Remain Silent**: You don't have to answer questions, but must provide identification if lawfully requested.

3. **Search Consent**: You can refuse consent to search your belongings, car, or home without a warrant.

4. **Recording**: Legal to record police in public, but don't interfere with their duties.

5. **Arrest Rights**: If arrested, you have the right to a phone call and an attorney.

**Key Points:**
- Don't run or resist
- Keep hands visible at all times
- Ask if you're free to leave
- Remember badge numbers and patrol car numbers
    `
  }
};

// Sample scripts for different scenarios
export const SAMPLE_SCRIPTS = {
  traffic_stop: [
    {
      id: 'ts_1',
      title: 'Initial Traffic Stop Response',
      content: "Officer, I'm going to keep my hands on the steering wheel. I'm reaching for my license and registration now. I understand you're doing your job.",
      language: 'en'
    },
    {
      id: 'ts_2',
      title: 'Declining Search',
      content: "Officer, I don't consent to any searches of my vehicle or person. I'm exercising my Fourth Amendment rights.",
      language: 'en'
    }
  ],
  search: [
    {
      id: 's_1',
      title: 'Refusing Consent to Search',
      content: "I do not consent to this search. I'm exercising my constitutional rights. Do you have a warrant?",
      language: 'en'
    }
  ],
  arrest: [
    {
      id: 'a_1',
      title: 'During Arrest',
      content: "I'm invoking my right to remain silent. I want to speak to a lawyer. I do not consent to any searches.",
      language: 'en'
    }
  ],
  general: [
    {
      id: 'g_1',
      title: 'General Interaction',
      content: "Am I free to leave? I'm exercising my right to remain silent. I don't consent to any searches.",
      language: 'en'
    }
  ]
};
