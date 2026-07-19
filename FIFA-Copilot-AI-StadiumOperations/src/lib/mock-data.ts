import type {
  Kpi,
  LiveEvent,
  Recommendation,
  Incident,
  TimelineItem,
  ChatMessage,
  OperationalMemory,
  StaffGroup,
  ReportMetric,
  StadiumNode,
  ContextSnapshot,
} from './types';

export const kpis: Kpi[] = [
  {
    id: 'health',
    label: 'Stadium Health',
    value: '87%',
    numeric: 87,
    delta: '+2.4%',
    trend: 'up',
    tone: 'safe',
    icon: 'activity',
  },
  {
    id: 'incidents',
    label: 'Active Incidents',
    value: '5',
    numeric: 5,
    delta: '+1',
    trend: 'up',
    tone: 'warning',
    icon: 'alert-triangle',
  },
  {
    id: 'risks',
    label: 'Critical Risks',
    value: '2',
    numeric: 2,
    delta: '0',
    trend: 'flat',
    tone: 'critical',
    icon: 'shield-alert',
  },
  {
    id: 'staff',
    label: 'Available Staff',
    value: '426',
    numeric: 426,
    delta: '-12',
    trend: 'down',
    tone: 'primary',
    icon: 'users',
  },
];

export const liveEvents: LiveEvent[] = [
  {
    id: 'e1',
    time: '15:25',
    title: 'Parking 92% Full',
    detail: 'Lot B nearing capacity. Overflow routing recommended.',
    severity: 'high',
    zone: 'Parking',
  },
  {
    id: 'e2',
    time: '15:24',
    title: 'VIP Arrival',
    detail: 'Delegation convoy approaching Gate 1.',
    severity: 'safe',
    zone: 'Gate 1',
  },
  {
    id: 'e3',
    time: '15:22',
    title: 'Heavy Rain Alert',
    detail: 'Precipitation rate 18mm/h expected for 25 min.',
    severity: 'warning',
    zone: 'Stadium-wide',
  },
  {
    id: 'e4',
    time: '15:21',
    title: 'Medical Emergency',
    detail: 'Section 214, paramedic team dispatched.',
    severity: 'critical',
    zone: 'Section 214',
  },
  {
    id: 'e5',
    time: '15:20',
    title: 'Gate 4 Queue Increasing',
    detail: 'Queue length 240m, growth +18% in 10 min.',
    severity: 'high',
    zone: 'Gate 4',
  },
  {
    id: 'e6',
    time: '15:17',
    title: 'Concession Stock OK',
    detail: 'All vendors reporting nominal inventory.',
    severity: 'safe',
    zone: 'Concourse',
  },
  {
    id: 'e7',
    time: '15:12',
    title: 'Crowd Density Rising',
    detail: 'Concourse density 71%, within safe envelope.',
    severity: 'warning',
    zone: 'Concourse',
  },
];

export const recommendations: Recommendation[] = [
  {
    id: 'r1',
    title: 'Open Gate 5',
    reason: 'Rain delayed arrivals causing queue growth at Gate 4. Predicted queue exceeds safe threshold in 8 minutes.',
    confidence: 94,
    impact: 'Queue reduced by approximately 30%. Wait time below SLA.',
    category: 'Crowd Flow',
    status: 'pending',
    zone: 'Gate 4 / Gate 5',
  },
  {
    id: 'r2',
    title: 'Dispatch Medical Team B to Section 214',
    reason: 'Reported cardiac symptoms. Nearest responder ETA 4 min; Team B ETA 90 sec.',
    confidence: 98,
    impact: 'Response time reduced from 4m to 90s. Life-safety priority.',
    category: 'Medical',
    status: 'accepted',
    zone: 'Section 214',
  },
  {
    id: 'r3',
    title: 'Activate Overflow Parking Lot C',
    reason: 'Lot B at 92%. Projected overflow demand 140 vehicles within 20 min.',
    confidence: 88,
    impact: 'Prevents gridlock on access road. 140 vehicles rerouted.',
    category: 'Parking',
    status: 'pending',
    zone: 'Parking',
  },
  {
    id: 'r4',
    title: 'Pre-position Security at Gate 1',
    reason: 'VIP delegation arrival imminent. Historical pattern shows 3x crowd surge on arrival.',
    confidence: 82,
    impact: 'Reduces incident probability by 45% during arrival window.',
    category: 'Security',
    status: 'pending',
    zone: 'Gate 1',
  },
];

export const incidents: Incident[] = [
  {
    id: 'i1',
    code: 'INC-2418',
    severity: 'critical',
    title: 'Medical Emergency — Section 214',
    assignedTeam: 'Medical Team B',
    eta: '1m 30s',
    priority: 'P1',
    status: 'active',
    zone: 'Section 214',
    reportedAt: '15:21',
    description:
      'Patron reporting chest pain and shortness of breath. Conscious and responsive. AED unit en route.',
    updates: [
      { time: '15:21', text: 'Incident reported by steward.', actor: 'Steward #14' },
      { time: '15:22', text: 'Medical Team B dispatched.', actor: 'Ops Console' },
      { time: '15:23', text: 'AED unit confirmed en route.', actor: 'Medical Lead' },
    ],
  },
  {
    id: 'i2',
    code: 'INC-2417',
    severity: 'high',
    title: 'Gate 4 Queue Congestion',
    assignedTeam: 'Crowd Mgmt Alpha',
    eta: '4m',
    priority: 'P1',
    status: 'acknowledged',
    zone: 'Gate 4',
    reportedAt: '15:20',
    description:
      'Queue length 240m and growing. Turnstile throughput below target. Rain impacting arrival rate.',
    updates: [
      { time: '15:20', text: 'Queue threshold breach detected by AI prediction.', actor: 'AI Copilot' },
      { time: '15:21', text: 'Crowd Management Alpha assigned.', actor: 'Ops Manager' },
    ],
  },
  {
    id: 'i3',
    code: 'INC-2416',
    severity: 'high',
    title: 'Parking Lot B Near Capacity',
    assignedTeam: 'Parking Control',
    eta: '6m',
    priority: 'P2',
    status: 'monitoring',
    zone: 'Parking',
    reportedAt: '15:25',
    description: 'Lot B at 92%. Overflow routing required within 15 min to avoid access road gridlock.',
    updates: [
      { time: '15:25', text: 'Capacity threshold crossed.', actor: 'Parking Sensor Net' },
    ],
  },
  {
    id: 'i4',
    code: 'INC-2415',
    severity: 'medium',
    title: 'Concession Queue Build-up — Concourse B',
    assignedTeam: 'Hospitality',
    eta: '12m',
    priority: 'P3',
    status: 'active',
    zone: 'Concourse B',
    reportedAt: '15:10',
    description: 'Queue times exceeding 8 min at 3 vendor stalls. Customer satisfaction risk.',
    updates: [
      { time: '15:10', text: 'Queue metric breach detected.', actor: 'Retail Analytics' },
      { time: '15:14', text: 'Additional till opened at stall 7.', actor: 'Hospitality Lead' },
    ],
  },
  {
    id: 'i5',
    code: 'INC-2414',
    severity: 'low',
    title: 'Turnstile 12 Sensor Drift',
    assignedTeam: 'Facilities',
    eta: '30m',
    priority: 'P4',
    status: 'resolved',
    zone: 'Gate 2',
    reportedAt: '14:58',
    description: 'Optical sensor reporting intermittent false counts. Recalibrated remotely.',
    updates: [
      { time: '14:58', text: 'Sensor anomaly flagged.', actor: 'Facilities Bot' },
      { time: '15:02', text: 'Remote recalibration successful.', actor: 'Facilities' },
      { time: '15:05', text: 'Verified accurate. Incident closed.', actor: 'Facilities' },
    ],
  },
];

export const timeline: TimelineItem[] = [
  { id: 't1', time: '15:18', title: 'Gate 4 Queue Started', description: 'Arrival rate spike detected post-rain.', type: 'alert' },
  { id: 't2', time: '15:20', title: 'Prediction Generated', description: 'AI forecast queue breach in 8 min at 94% confidence.', type: 'prediction' },
  { id: 't3', time: '15:21', title: 'Recommendation Accepted', description: 'Ops Manager accepted Open Gate 5 recommendation.', type: 'action' },
  { id: 't4', time: '15:24', title: 'Volunteers Assigned', description: '12 crowd volunteers redirected to Gate 5.', type: 'action' },
  { id: 't5', time: '15:27', title: 'Queue Reduced', description: 'Gate 4 queue down 31%. Within safe envelope.', type: 'resolution' },
];

export const chatMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    content:
      'Good afternoon. Live operations are being monitored for Match 47 at Lusail Stadium. Two critical items need attention now: a medical emergency in Section 214 and a growing queue at Gate 4. I have prepared recommendations for both.',
    time: '15:20',
  },
  {
    id: 'm2',
    role: 'user',
    content: 'What needs attention right now?',
    time: '15:22',
  },
  {
    id: 'm3',
    role: 'assistant',
    content:
      'Two priority items require immediate action:\n\n1. Medical Emergency — Section 214 (P1): Patron reporting cardiac symptoms. Medical Team B is 90 seconds away. Recommend confirming dispatch.\n\n2. Gate 4 Queue Congestion (P1): Queue at 240m and growing. At current rate it breaches safe threshold in 8 minutes. I recommend opening Gate 5 to split the load — projected to reduce queue by ~30%.',
    time: '15:22',
    citations: ['INC-2418', 'INC-2417', 'REC-r1'],
  },
];

export const operationalMemory: OperationalMemory[] = [
  {
    id: 'om1',
    match: 'Match 31 — Semi Final',
    date: '2026-06-14',
    situation: 'Heavy rain 20 min before kickoff caused Gate 4 congestion. Queue reached 260m.',
    action: 'Opened Gate 5 and redirected 12 volunteers. Activated covered walkway routing.',
    outcome: 'Queue reduced 31% within 9 minutes. No safety incidents.',
    effectiveness: 94,
    tags: ['rain', 'gate-congestion', 'crowd-flow'],
  },
  {
    id: 'om2',
    match: 'Match 22 — Group Stage',
    date: '2026-05-28',
    situation: 'VIP delegation arrival coincided with general crowd surge at Gate 1.',
    action: 'Pre-positioned 8 security personnel and created dedicated VIP lane 20 min prior.',
    outcome: 'Zero incidents during arrival. Crowd flow unaffected for general public.',
    effectiveness: 88,
    tags: ['vip', 'security', 'gate-1'],
  },
  {
    id: 'om3',
    match: 'Match 18 — Group Stage',
    date: '2026-05-15',
    situation: 'Parking Lot B reached 94% with 140 vehicles still inbound.',
    action: 'Activated overflow Lot C early and broadcast rerouting via app + signage.',
    outcome: 'No gridlock. All vehicles parked within 18 min of arrival.',
    effectiveness: 91,
    tags: ['parking', 'overflow', 'traffic'],
  },
  {
    id: 'om4',
    match: 'Match 09 — Quarter Final',
    date: '2026-04-30',
    situation: 'Concession queue build-up at Concourse B exceeding 8 min wait.',
    action: 'Opened 2 additional tills and deployed mobile ordering stations.',
    outcome: 'Wait times dropped to 3 min. Satisfaction score recovered to 4.6/5.',
    effectiveness: 86,
    tags: ['concession', 'concourse', 'hospitality'],
  },
  {
    id: 'om5',
    match: 'Match 04 — Opening',
    date: '2026-04-08',
    situation: 'Turnstile sensor drift caused inaccurate throughput counts at Gate 2.',
    action: 'Implemented remote recalibration protocol. Added dual-sensor verification.',
    outcome: 'Count accuracy restored to 99.4%. Protocol adopted as standard.',
    effectiveness: 97,
    tags: ['sensor', 'gate-2', 'facilities'],
  },
  {
    id: 'om6',
    match: 'Match 41 — Round of 16',
    date: '2026-07-02',
    situation: 'Crowd density on concourse peaked at 84% during halftime surge.',
    action: 'Staggered concession opening times and redirected flow via Gate 3 concourse.',
    outcome: 'Density stabilized at 71% within 6 minutes. No compression risk.',
    effectiveness: 90,
    tags: ['crowd-density', 'concourse', 'halftime'],
  },
];

export const staffGroups: StaffGroup[] = [
  { id: 's1', name: 'Medical', available: 18, total: 24, location: 'Stations A–D', lead: 'Dr. H. Nasser' },
  { id: 's2', name: 'Security', available: 142, total: 180, location: 'All gates', lead: 'Capt. M. Lopez' },
  { id: 's3', name: 'Crowd Mgmt', available: 96, total: 120, location: 'Concourse', lead: 'A. Petrov' },
  { id: 's4', name: 'Stewards', available: 110, total: 140, location: 'Sections', lead: 'S. Okafor' },
  { id: 's5', name: 'Facilities', available: 38, total: 42, location: 'Back-of-house', lead: 'R. Yamada' },
  { id: 's6', name: 'Hospitality', available: 22, total: 30, location: 'Concourse B', lead: 'L. Martin' },
];

export const reportMetrics: ReportMetric[] = [
  {
    id: 'rm1',
    title: 'Match Summary',
    value: 'Match 47',
    sub: 'Lusail Stadium · 60,214 attendees',
    tone: 'primary',
    icon: 'file-text',
  },
  {
    id: 'rm2',
    title: 'Incident Statistics',
    value: '12 incidents',
    sub: '2 critical · 4 high · 6 medium',
    tone: 'high',
    icon: 'alert-octagon',
  },
  {
    id: 'rm3',
    title: 'Average Response Time',
    value: '3m 42s',
    sub: '−18% vs. season average',
    trend: 'Improving',
    tone: 'safe',
    icon: 'timer',
  },
  {
    id: 'rm4',
    title: 'Recommendation Accuracy',
    value: '91.4%',
    sub: '38 of 42 recommendations effective',
    trend: '+3.2%',
    tone: 'safe',
    icon: 'target',
  },
  {
    id: 'rm5',
    title: 'Operational Learning',
    value: '6 new memories',
    sub: 'Added to operational knowledge base',
    tone: 'primary',
    icon: 'brain-circuit',
  },
];

export const stadiumNodes: StadiumNode[] = [
  { id: 'n1', label: 'Gate 1', type: 'gate', x: 50, y: 12, load: 62, severity: 'safe' },
  { id: 'n2', label: 'Gate 2', type: 'gate', x: 22, y: 50, load: 48, severity: 'safe' },
  { id: 'n3', label: 'Gate 3', type: 'gate', x: 78, y: 50, load: 71, severity: 'warning' },
  { id: 'n4', label: 'Gate 4', type: 'gate', x: 50, y: 88, load: 94, severity: 'critical' },
  { id: 'n5', label: 'Medical', type: 'medical', x: 50, y: 50, load: 40, severity: 'high' },
  { id: 'n6', label: 'Parking', type: 'parking', x: 12, y: 88, load: 92, severity: 'high' },
  { id: 'n7', label: 'Security', type: 'security', x: 88, y: 88, load: 55, severity: 'safe' },
];

export const contextSnapshot: ContextSnapshot = {
  weather: 'Heavy Rain',
  temperature: 17,
  crowdDensity: 71,
  capacity: 68000,
  attendance: 60214,
  activeIncidents: 5,
  openRecommendations: 4,
};

export const suggestedPrompts = [
  'What needs attention?',
  'Summarize the last 30 minutes.',
  'Why is Gate 4 delayed?',
  'Generate match report.',
  'Show current crowd density.',
  'Which recommendations are pending?',
];

export const crowdDensitySeries = [
  { time: '14:30', density: 22, gate4: 12 },
  { time: '14:45', density: 31, gate4: 18 },
  { time: '15:00', density: 44, gate4: 28 },
  { time: '15:05', density: 52, gate4: 41 },
  { time: '15:10', density: 58, gate4: 55 },
  { time: '15:15', density: 64, gate4: 72 },
  { time: '15:20', density: 71, gate4: 94 },
];

export const responseTimeSeries = [
  { match: 'M04', minutes: 5.8 },
  { match: 'M09', minutes: 5.1 },
  { match: 'M18', minutes: 4.6 },
  { match: 'M22', minutes: 4.2 },
  { match: 'M31', minutes: 3.9 },
  { match: 'M41', minutes: 3.7 },
  { match: 'M47', minutes: 3.6 },
];

export const recommendationAccuracySeries = [
  { month: 'Apr', accuracy: 82 },
  { month: 'May', accuracy: 85 },
  { month: 'Jun', accuracy: 88 },
  { month: 'Jul', accuracy: 91 },
];
