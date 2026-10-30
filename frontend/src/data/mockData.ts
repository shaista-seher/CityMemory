import { Asset, MaintenanceRecord, HighPriorityAlert, AIPredictionItem, WardSummary, CitizenUser, OfficerUser, CitizenComplaint, ComplaintCluster } from '../types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'SWD-1042',
    name: '100ft Road Primary Stormwater Culvert',
    category: 'Stormwater Drain',
    ward: 'Ward 12 (Indiranagar)',
    zone: 'East Zone',
    coordinates: [12.9784, 77.6408],
    installationDate: '2018-04-12',
    currentCondition: 'Poor',
    conditionScore: 42,
    riskScore: 88,
    riskLevel: 'Critical',
    lastMaintenance: '2026-06-18',
    nextScheduledMaintenance: '2026-11-05',
    responsibleDepartment: 'BBMP Stormwater Drain Division',
    status: 'Degraded',
    estimatedFailureWindow: '6 - 12 days',
    failureProbability: 86,
    criticality: 'High',
    recurringFailurePatterns: [
      'Pre-monsoon silt sedimentation choking culvert throat by 65%',
      'Commercial grease effluent discharge from 12th Main food outlets',
      'Hydraulic backflow pressure surges during heavy downpours (>45mm/hr)'
    ],
    weaknessFactors: [
      { factor: 'Silt Sedimentation Rate', impact: 88 },
      { factor: 'Upstream Runoff Inflow', impact: 76 },
      { factor: 'Maintenance Interval Gap', impact: 64 },
      { factor: 'Structural Concrete Spalling', impact: 42 }
    ],
    recommendedAction: 'Immediate high-velocity desilting truck deployment and robotic CCTV slab inspection before scheduled monsoon spell.',
    estimatedPreventiveCost: 85000,
    estimatedReactiveFailureCost: 940000,
    conditionHistory: [
      { date: '2024-03-10', conditionScore: 84, riskScore: 22, inspector: 'Er. R. Venkatesh', notes: 'Normal flow, minor weed growth' },
      { date: '2025-01-15', conditionScore: 71, riskScore: 44, inspector: 'Er. Suresh Rao', notes: 'Moderate silt deposit observed near intake' },
      { date: '2025-09-20', conditionScore: 56, riskScore: 68, inspector: 'Er. Suresh Rao', notes: 'High siltation, commercial grease buildup' },
      { date: '2026-06-18', conditionScore: 42, riskScore: 88, inspector: 'Er. Priya Natarajan', notes: 'Severe choking, micro-cracks on culvert lintel' }
    ],
    history: [
      {
        id: 'EV-1042-1',
        date: '2018-04-12',
        title: 'RCC Box Culvert Commissioning',
        description: 'Completed 2.4m x 1.8m reinforced concrete box culvert connecting to primary storm drain network.',
        type: 'Installation',
        status: 'Completed',
        cost: 3200000,
        department: 'BBMP Major Stormwater Cell',
        officer: 'Chief Engineer M. Balaji'
      },
      {
        id: 'EV-1042-2',
        date: '2020-09-14',
        title: 'Severe Waterlogging Complaint #IND-902',
        description: 'Residents reported 2ft flooding on 100ft Road intersection during 50mm sudden cloudburst.',
        type: 'Complaint',
        status: 'Verified',
        department: 'BBMP East Control Room',
        evidenceNotes: 'Culvert was choked with unsegregated commercial waste.'
      },
      {
        id: 'EV-1042-3',
        date: '2021-05-18',
        title: 'Emergency Desilting & Trash Screen Fitting',
        description: 'Hydraulic suction desilting carried out; stainless steel debris barrier installed at upstream grate.',
        type: 'Repair',
        status: 'Completed',
        cost: 210000,
        department: 'BBMP Stormwater Drain Division',
        officer: 'Er. R. Venkatesh'
      },
      {
        id: 'EV-1042-4',
        date: '2023-08-22',
        title: 'Monsoon Pressure Fracture',
        description: 'Minor structural cracking observed on slab ceiling under continuous heavy commercial transit loading.',
        type: 'Failure',
        status: 'Flagged',
        cost: 145000,
        department: 'BBMP Quality Assurance Wing',
        evidenceNotes: 'Concrete core testing showed compressive strength degradation of 18%.'
      },
      {
        id: 'EV-1042-5',
        date: '2025-02-11',
        title: 'Bi-Annual Preventive Silt Clearance',
        description: 'Excavator removed 14 tonnes of accumulated municipal silt and plastic residues.',
        type: 'Maintenance',
        status: 'Completed',
        cost: 95000,
        department: 'BBMP Stormwater Drain Division',
        officer: 'Er. Suresh Rao'
      },
      {
        id: 'EV-1042-6',
        date: '2026-06-18',
        title: 'AI Anomaly Alert: Chronic Hydraulic Bottleneck',
        description: 'CityMemory telemetry detected runoff clearance velocity dropped by 58% compared to historical baseline.',
        type: 'Inspection',
        status: 'Flagged',
        department: 'CityMemory Predictive Engine',
        officer: 'AI Diagnostic Protocol 4.2'
      }
    ]
  },
  {
    id: 'RD-2081',
    name: 'Sampige Road Commercial Arterial (Ch. 1+200)',
    category: 'Road',
    ward: 'Ward 08 (Malleshwaram)',
    zone: 'West Zone',
    coordinates: [13.0031, 77.5714],
    installationDate: '2019-11-20',
    currentCondition: 'Fair',
    conditionScore: 58,
    riskScore: 74,
    riskLevel: 'High',
    lastMaintenance: '2026-05-04',
    nextScheduledMaintenance: '2026-11-12',
    responsibleDepartment: 'BBMP Road Infrastructure Cell',
    status: 'Operational',
    estimatedFailureWindow: '14 - 21 days',
    failureProbability: 73,
    criticality: 'High',
    recurringFailurePatterns: [
      'Sub-base water percolation from recurring underground pipe leaks',
      'Alligator cracking in outer bus lane due to frequent stationary bus braking'
    ],
    weaknessFactors: [
      { factor: 'Pavement Moisture Infiltration', impact: 79 },
      { factor: 'Heavy Bus Axle Load Stress', impact: 71 },
      { factor: 'Bitumen Oxidation Age', impact: 62 },
      { factor: 'Subgrade CBR Ratio', impact: 48 }
    ],
    recommendedAction: 'Milling of damaged surface course and applying polymer modified mastic asphalt overlay to seal moisture pathways.',
    estimatedPreventiveCost: 320000,
    estimatedReactiveFailureCost: 1850000,
    conditionHistory: [
      { date: '2023-11-10', conditionScore: 89, riskScore: 18, inspector: 'Er. K. Murthy', notes: 'Smooth riding surface, no distress' },
      { date: '2024-10-18', conditionScore: 78, riskScore: 36, inspector: 'Er. K. Murthy', notes: 'Hairline longitudinal cracks in bus lane' },
      { date: '2025-08-14', conditionScore: 66, riskScore: 55, inspector: 'Er. Deepak Hegde', notes: 'Alligator cracking spreading near bus stop' },
      { date: '2026-05-04', conditionScore: 58, riskScore: 74, inspector: 'Er. Deepak Hegde', notes: 'Pothole cluster forming post utility trenching' }
    ],
    history: [
      {
        id: 'EV-2081-1',
        date: '2019-11-20',
        title: 'Asphalt Concrete Overlay (Tender SURE Specs)',
        description: 'Complete 4-lane milling and resurfacing with 50mm Bituminous Concrete (BC) layer.',
        type: 'Installation',
        status: 'Completed',
        cost: 4800000,
        department: 'BBMP Road Infrastructure Cell',
        officer: 'Superintending Engineer V. Prasad'
      },
      {
        id: 'EV-2081-2',
        date: '2022-04-03',
        title: 'Utility Road Cut by Water Board',
        description: 'Unplanned trenching executed by BWSSB for 300mm pipe replacement across northbound carriage.',
        type: 'Maintenance',
        status: 'Completed',
        department: 'BWSSB West Sub-division',
        evidenceNotes: 'Sub-base compaction lacked optimal vibratory roller passes.'
      },
      {
        id: 'EV-2081-3',
        date: '2024-07-29',
        title: 'Monsoon Pothole Outbreak',
        description: 'Citizen grievance portal recorded 18 complaints within 48 hours for rim-damaging potholes.',
        type: 'Complaint',
        status: 'Verified',
        cost: 85000,
        department: 'BBMP Ward 08 Engineering Team',
        officer: 'Er. K. Murthy'
      },
      {
        id: 'EV-2081-4',
        date: '2026-05-04',
        title: 'Cold Mix Emergency Patchwork',
        description: 'Temporary bitumen cold-mix patching applied over 45 sq. meters of distressed asphalt.',
        type: 'Repair',
        status: 'Completed',
        cost: 110000,
        department: 'BBMP Pothole Quick Response Team',
        officer: 'Er. Deepak Hegde'
      }
    ]
  },
  {
    id: 'WL-3015',
    name: '14th Main High-Pressure Feeder Pipeline (500mm DI)',
    category: 'Water Pipeline',
    ward: 'Ward 15 (Koramangala)',
    zone: 'South Zone',
    coordinates: [12.9344, 77.6254],
    installationDate: '2016-08-30',
    currentCondition: 'Poor',
    conditionScore: 38,
    riskScore: 92,
    riskLevel: 'Critical',
    lastMaintenance: '2026-04-12',
    nextScheduledMaintenance: '2026-11-03',
    responsibleDepartment: 'BWSSB Water Supply & Sewerage Board',
    status: 'Operational',
    estimatedFailureWindow: '3 - 7 days',
    failureProbability: 91,
    criticality: 'High',
    recurringFailurePatterns: [
      'Cavitation hammer shocks during morning booster pump startup (05:30 AM)',
      'Severe external soil galvanic corrosion caused by brackish wastewater seepage'
    ],
    weaknessFactors: [
      { factor: 'Surge Pressure Transients', impact: 94 },
      { factor: 'External Pipe Wall Thinning', impact: 86 },
      { factor: 'Soil Corrosivity Index', impact: 72 },
      { factor: 'Joint Seal Elasticity Loss', impact: 68 }
    ],
    recommendedAction: 'Urgent acoustic leak correlation test, surge relief valve recalibration, and sleeve clamp reinforcement on joint #14.',
    estimatedPreventiveCost: 140000,
    estimatedReactiveFailureCost: 1420000,
    conditionHistory: [
      { date: '2023-04-15', conditionScore: 78, riskScore: 35, inspector: 'Er. S. Chandrashekar', notes: 'Slight pressure fluctuation on telemetry' },
      { date: '2024-09-02', conditionScore: 62, riskScore: 58, inspector: 'Er. S. Chandrashekar', notes: 'Minor joint weeping detected near 3rd Cross' },
      { date: '2025-06-19', conditionScore: 49, riskScore: 76, inspector: 'Er. Ananya Gupta', notes: 'Pipe wall ultrasonic scan shows 32% thinning' },
      { date: '2026-04-12', conditionScore: 38, riskScore: 92, inspector: 'Er. Ananya Gupta', notes: 'Water hammer acoustic peaks exceeding safe MPa threshold' }
    ],
    history: [
      {
        id: 'EV-3015-1',
        date: '2016-08-30',
        title: 'Cauvery Water Distribution Ductile Iron Main Laying',
        description: 'Installed 500mm Class K9 Ductile Iron pipeline with zinc coating and bitumen exterior finish.',
        type: 'Installation',
        status: 'Completed',
        cost: 6500000,
        department: 'BWSSB Project Wing',
        officer: 'Chief Engineer T. S. Ramesh'
      },
      {
        id: 'EV-3015-2',
        date: '2021-12-08',
        title: 'Major Burst at 14th Main & 4th Cross',
        description: 'Rupture released 400,000 liters of potable water, flooding 12 residences and washing away road sub-base.',
        type: 'Failure',
        status: 'Completed',
        cost: 580000,
        department: 'BWSSB Emergency Wing',
        evidenceNotes: 'Failure caused by uncontrolled pump trip in southern balancing reservoir.'
      },
      {
        id: 'EV-3015-3',
        date: '2023-05-14',
        title: 'Air Valve Replacement & Surge Chamber Service',
        description: 'Replaced 2 kinetic air release valves with dual-orifice tamper-resistant assemblies.',
        type: 'Maintenance',
        status: 'Completed',
        cost: 160000,
        department: 'BWSSB Koramangala Sub-division',
        officer: 'Er. S. Chandrashekar'
      },
      {
        id: 'EV-3015-4',
        date: '2026-04-12',
        title: 'Acoustic Sensor Telemetry Alert',
        description: 'IoT hydrophone logged characteristic high-frequency pinhole leak vibration profile (3.2 kHz).',
        type: 'Inspection',
        status: 'Flagged',
        department: 'CityMemory Acoustic Surveillance',
        officer: 'Automated Pipeline Health Monitor'
      }
    ]
  },
  {
    id: 'SL-4022',
    name: 'Bellary Road Smart LED Mast Cluster 4 (12 Units)',
    category: 'Streetlight',
    ward: 'Ward 04 (Hebbal)',
    zone: 'North Zone',
    coordinates: [13.0358, 77.5970],
    installationDate: '2022-02-15',
    currentCondition: 'Good',
    conditionScore: 86,
    riskScore: 19,
    riskLevel: 'Healthy',
    lastMaintenance: '2026-08-20',
    nextScheduledMaintenance: '2027-02-20',
    responsibleDepartment: 'BESCOM Electrical Grid & Lighting Division',
    status: 'Operational',
    estimatedFailureWindow: '> 180 days',
    failureProbability: 12,
    criticality: 'Medium',
    recurringFailurePatterns: [
      'Low failure history; occasional SPD surge arrestor trip during pre-monsoon lightning'
    ],
    weaknessFactors: [
      { factor: 'Grid Voltage Fluctuation', impact: 28 },
      { factor: 'Thermal Driver Dissipation', impact: 22 },
      { factor: 'Atmospheric PM2.5 Soot Coating', impact: 18 }
    ],
    recommendedAction: 'Standard scheduled photometric luminaire wash and terminal torque check in Q1 2027.',
    estimatedPreventiveCost: 18000,
    estimatedReactiveFailureCost: 125000,
    conditionHistory: [
      { date: '2024-02-14', conditionScore: 94, riskScore: 10, inspector: 'Er. Vinod Patil', notes: 'Photometrics nominal, 100% lumen efficacy' },
      { date: '2025-08-19', conditionScore: 90, riskScore: 14, inspector: 'Er. Vinod Patil', notes: 'Minor dust accumulation on optical lens' },
      { date: '2026-08-20', conditionScore: 86, riskScore: 19, inspector: 'Er. Vinod Patil', notes: 'All drivers operational, zero lux decay' }
    ],
    history: [
      {
        id: 'EV-4022-1',
        date: '2022-02-15',
        title: 'Smart LED Highway High-Mast Commissioning',
        description: 'Installed 120W IP66 Philips LED luminaires with LoRaWAN wireless dimming control nodes.',
        type: 'Installation',
        status: 'Completed',
        cost: 1400000,
        department: 'BESCOM Smart Lighting Cell',
        officer: 'Assistant Executive Engineer N. Mohan'
      },
      {
        id: 'EV-4022-2',
        date: '2024-05-22',
        title: 'Lightning Surge Diverter Replacement',
        description: 'Class II surge protection module tripped safely during thunderstorms; replaced under warranty.',
        type: 'Maintenance',
        status: 'Completed',
        cost: 12000,
        department: 'BESCOM Hebbal Section',
        officer: 'Er. Vinod Patil'
      },
      {
        id: 'EV-4022-3',
        date: '2026-08-20',
        title: 'Scheduled Luminaire Health Audit',
        description: 'Cleaned optical diffusers and confirmed automated lux dimming schedule operational.',
        type: 'Inspection',
        status: 'Completed',
        department: 'BESCOM Operations',
        officer: 'Er. Vinod Patil'
      }
    ]
  },
  {
    id: 'BR-5011',
    name: 'Sirsi Circle Flyover Pier 14 Expansion Joint',
    category: 'Bridge & Flyover',
    ward: 'Ward 31 (Jayanagar / Chamrajpet)',
    zone: 'South Zone',
    coordinates: [12.9562, 77.5684],
    installationDate: '2017-06-10',
    currentCondition: 'Fair',
    conditionScore: 61,
    riskScore: 68,
    riskLevel: 'Moderate',
    lastMaintenance: '2026-03-15',
    nextScheduledMaintenance: '2026-11-20',
    responsibleDepartment: 'BBMP Major Bridge Infrastructure Wing',
    status: 'Operational',
    estimatedFailureWindow: '30 - 45 days',
    failureProbability: 58,
    criticality: 'High',
    recurringFailurePatterns: [
      'Neoprene elastomeric seal tearing under continuous heavy multi-axle freight braking',
      'Rainwater drainage spout clogging directing salty runoff onto pier cap'
    ],
    weaknessFactors: [
      { factor: 'Cyclic Thermal Expansion Strain', impact: 74 },
      { factor: 'Elastomer Ageing & Hardening', impact: 68 },
      { factor: 'Debris Lodged in Finger Gap', impact: 52 },
      { factor: 'Pier Bearing Misalignment', impact: 31 }
    ],
    recommendedAction: 'Replace worn neoprene compression seal, jet-clean expansion gap, and apply epoxy coating to concrete pedestal.',
    estimatedPreventiveCost: 195000,
    estimatedReactiveFailureCost: 1650000,
    conditionHistory: [
      { date: '2023-06-08', conditionScore: 81, riskScore: 28, inspector: 'Dr. C. Nagaraj', notes: 'Structural vibrations within allowable Eurocode tolerance' },
      { date: '2024-11-12', conditionScore: 73, riskScore: 45, inspector: 'Dr. C. Nagaraj', notes: 'Elastomeric gland showing 20mm horizontal tear' },
      { date: '2026-03-15', conditionScore: 61, riskScore: 68, inspector: 'Er. G. Ravikumar', notes: 'Noticeable vehicle thud sound, water seepage onto pier 14' }
    ],
    history: [
      {
        id: 'EV-5011-1',
        date: '2017-06-10',
        title: 'Modular Expansion Joint Installation',
        description: 'Installed Maurer-type modular steel & neoprene joint rated for 80mm longitudinal displacement.',
        type: 'Installation',
        status: 'Completed',
        cost: 2800000,
        department: 'BBMP Major Bridge Infrastructure Wing',
        officer: 'Chief Engineer S. K. Narayana'
      },
      {
        id: 'EV-5011-2',
        date: '2021-08-04',
        title: 'Vibration & Crack Audit',
        description: 'Detailed structural health study carried out using accelerometers; bearing pads confirmed healthy.',
        type: 'Inspection',
        status: 'Completed',
        cost: 180000,
        department: 'IISc Civil Engineering Consultancy & BBMP',
        officer: 'Dr. C. Nagaraj'
      },
      {
        id: 'EV-5011-3',
        date: '2026-03-15',
        title: 'Preventive Joint Wash & Debris Vacuuming',
        description: 'High-pressure water jetting cleared gravel and metallic debris caught in movement teeth.',
        type: 'Maintenance',
        status: 'Completed',
        cost: 45000,
        department: 'BBMP Bridges Maintenance Wing',
        officer: 'Er. G. Ravikumar'
      }
    ]
  },
  {
    id: 'SWD-1099',
    name: 'Ejipura Canal Outfall Gate & Spillway Channel',
    category: 'Stormwater Drain',
    ward: 'Ward 15 (Koramangala)',
    zone: 'South Zone',
    coordinates: [12.9422, 77.6321],
    installationDate: '2017-03-18',
    currentCondition: 'Critical',
    conditionScore: 31,
    riskScore: 94,
    riskLevel: 'Critical',
    lastMaintenance: '2026-05-19',
    nextScheduledMaintenance: '2026-11-02',
    responsibleDepartment: 'BBMP Stormwater Drain Division',
    status: 'Degraded',
    estimatedFailureWindow: '2 - 5 days',
    failureProbability: 94,
    criticality: 'High',
    recurringFailurePatterns: [
      'Chronic reverse tidal backflow during cloudburst events',
      'Solid waste accumulation choking hydraulic flap valve hinges'
    ],
    weaknessFactors: [
      { factor: 'Flap Gate Mechanical Jamming', impact: 96 },
      { factor: 'Canal Embankment Scour', impact: 89 },
      { factor: 'Accumulated Silt Volume', impact: 82 },
      { factor: 'Trash Screen Deformation', impact: 74 }
    ],
    recommendedAction: 'Immediate crane deployment to unjam counterweight flap gate, deploy floating boom barrier, and dredge 40m outfall canal.',
    estimatedPreventiveCost: 110000,
    estimatedReactiveFailureCost: 1890000,
    conditionHistory: [
      { date: '2024-04-18', conditionScore: 68, riskScore: 49, inspector: 'Er. Suresh Rao', notes: 'Flap gate operating with slight friction' },
      { date: '2025-05-22', conditionScore: 47, riskScore: 78, inspector: 'Er. Suresh Rao', notes: 'Silt wedge preventing full gate closure' },
      { date: '2026-05-19', conditionScore: 31, riskScore: 94, inspector: 'Er. Priya Natarajan', notes: 'Gate stuck at 35% open position, severe scour' }
    ],
    history: [
      {
        id: 'EV-1099-1',
        date: '2017-03-18',
        title: 'Automated Flap Gate Commissioning',
        description: 'Installed 3.0m ductile cast-iron backflow flap gate to prevent Bellandur lake surge.',
        type: 'Installation',
        status: 'Completed',
        cost: 4100000,
        department: 'BBMP Lake & Drain Division'
      },
      {
        id: 'EV-1099-2',
        date: '2022-09-05',
        title: 'Ejipura Inundation Catastrophe',
        description: 'Stuck flap gate led to 3.5ft backflow into residential 1st to 4th blocks during 100mm storm.',
        type: 'Failure',
        status: 'Completed',
        cost: 740000,
        department: 'Disaster Management Cell Karnataka'
      },
      {
        id: 'EV-1099-3',
        date: '2026-05-19',
        title: 'Emergency Debris Clearance',
        description: 'Manual divers extracted tangled cables, mattress frames, and plastic bags wedging the gate.',
        type: 'Repair',
        status: 'Completed',
        cost: 65000,
        department: 'BBMP Quick Response Team'
      }
    ]
  },
  {
    id: 'RD-2104',
    name: 'ITPL Main Avenue Technology Corridor',
    category: 'Road',
    ward: 'Ward 22 (Whitefield)',
    zone: 'Mahadevapura Zone',
    coordinates: [12.9865, 77.7289],
    installationDate: '2020-01-25',
    currentCondition: 'Poor',
    conditionScore: 45,
    riskScore: 82,
    riskLevel: 'High',
    lastMaintenance: '2026-06-02',
    nextScheduledMaintenance: '2026-11-15',
    responsibleDepartment: 'BBMP Road Infrastructure Cell',
    status: 'Operational',
    estimatedFailureWindow: '10 - 15 days',
    failureProbability: 81,
    criticality: 'High',
    recurringFailurePatterns: [
      'Asphalt shear deformation under heavy tech-shuttle bus traffic',
      'Edge breakages caused by lack of continuous concrete shoulder kerbing'
    ],
    weaknessFactors: [
      { factor: 'Pavement Rutting Depth (>18mm)', impact: 84 },
      { factor: 'Commercial Traffic Volume Index', impact: 82 },
      { factor: 'Sub-base Water Saturation', impact: 65 },
      { factor: 'Longitudinal Crack Density', impact: 59 }
    ],
    recommendedAction: 'Perform high-pressure micro-milling and lay 40mm Stone Matrix Asphalt (SMA) with anti-stripping agent.',
    estimatedPreventiveCost: 450000,
    estimatedReactiveFailureCost: 2600000,
    conditionHistory: [
      { date: '2024-03-22', conditionScore: 79, riskScore: 32, inspector: 'Er. Rajesh Gowda', notes: 'Surface texture adequate' },
      { date: '2025-07-15', conditionScore: 61, riskScore: 62, inspector: 'Er. Rajesh Gowda', notes: 'Rutting depth reached 12mm in bus lane' },
      { date: '2026-06-02', conditionScore: 45, riskScore: 82, inspector: 'Er. Rajesh Gowda', notes: 'Rutting 19mm, edge crumbling near Metro pier 114' }
    ],
    history: [
      {
        id: 'EV-2104-1',
        date: '2020-01-25',
        title: 'Asphalt Resurfacing Post-Metro Line Expansion',
        description: 'Laid dense bituminous macadam and wearing course along 2.8 km corridor.',
        type: 'Installation',
        status: 'Completed',
        cost: 8900000,
        department: 'BMRCL & BBMP Infrastructure'
      },
      {
        id: 'EV-2104-2',
        date: '2025-07-28',
        title: 'Traffic Police Advisory #WFD-44',
        description: 'Notice issued regarding vehicle swerving to avoid severe asphalt depressions.',
        type: 'Complaint',
        status: 'Verified',
        department: 'Whitefield Traffic Division'
      },
      {
        id: 'EV-2104-3',
        date: '2026-06-02',
        title: 'Leveling Course Patching',
        description: 'Applied 18 tonnes hot-mix asphalt for temporary longitudinal wheel-path leveling.',
        type: 'Maintenance',
        status: 'Completed',
        cost: 185000,
        department: 'BBMP Mahadevapura Division'
      }
    ]
  },
  {
    id: 'WL-3088',
    name: 'Cauvery Stage IV Header Line (600mm MS)',
    category: 'Water Pipeline',
    ward: 'Ward 18 (Rajajinagar)',
    zone: 'West Zone',
    coordinates: [12.9981, 77.5532],
    installationDate: '2021-09-10',
    currentCondition: 'Good',
    conditionScore: 88,
    riskScore: 16,
    riskLevel: 'Healthy',
    lastMaintenance: '2026-07-14',
    nextScheduledMaintenance: '2027-01-14',
    responsibleDepartment: 'BWSSB Transmission Division',
    status: 'Operational',
    estimatedFailureWindow: '> 365 days',
    failureProbability: 8,
    criticality: 'High',
    recurringFailurePatterns: [
      'Minimal issues recorded; cathode protection current within optimal range (-850mV to -1200mV)'
    ],
    weaknessFactors: [
      { factor: 'Minor External Vibration', impact: 19 },
      { factor: 'Cathodic Anode Depletion', impact: 14 }
    ],
    recommendedAction: 'Routine quarterly cathodic protection potential measurement and telemetry check.',
    estimatedPreventiveCost: 25000,
    estimatedReactiveFailureCost: 1950000,
    conditionHistory: [
      { date: '2024-09-12', conditionScore: 95, riskScore: 9, inspector: 'Er. C. K. Narahari', notes: 'All sensor nodes transmitting nominal data' },
      { date: '2026-07-14', conditionScore: 88, riskScore: 16, inspector: 'Er. C. K. Narahari', notes: 'Cathodic potential -940mV, wall thickness nominal' }
    ],
    history: [
      {
        id: 'EV-3088-1',
        date: '2021-09-10',
        title: 'Mild Steel Header Line Commissioning',
        description: '600mm MS pipeline with internal epoxy lining and sacrificial magnesium anode bed.',
        type: 'Installation',
        status: 'Completed',
        cost: 9200000,
        department: 'BWSSB Cauvery Projects'
      },
      {
        id: 'EV-3088-2',
        date: '2026-07-14',
        title: 'Annual Ultrasonic Thickness Scan',
        description: 'Measured 12 inspection points; wall thickness remains 98.4% of design specification.',
        type: 'Inspection',
        status: 'Completed',
        department: 'BWSSB Quality Wing'
      }
    ]
  },
  {
    id: 'SL-4058',
    name: 'Outer Ring Road Expressway Luminaire Sector 9',
    category: 'Streetlight',
    ward: 'Ward 22 (Whitefield)',
    zone: 'Mahadevapura Zone',
    coordinates: [12.9691, 77.7012],
    installationDate: '2021-05-10',
    currentCondition: 'Fair',
    conditionScore: 68,
    riskScore: 54,
    riskLevel: 'Moderate',
    lastMaintenance: '2026-04-18',
    nextScheduledMaintenance: '2026-11-25',
    responsibleDepartment: 'BESCOM Electrical Grid & Lighting Division',
    status: 'Operational',
    estimatedFailureWindow: '45 - 60 days',
    failureProbability: 46,
    criticality: 'Medium',
    recurringFailurePatterns: [
      'Underground cable moisture ingress near metro construction pillars causing feeder breaker tripping'
    ],
    weaknessFactors: [
      { factor: 'Armored Cable Insulation Resistance', impact: 68 },
      { factor: 'Feeder Pillar Weather Sealing', impact: 54 },
      { factor: 'Vibration-induced Luminaire Loosening', impact: 38 }
    ],
    recommendedAction: 'Perform megger insulation resistance testing on Feeder 4B and replace degraded splice kits.',
    estimatedPreventiveCost: 35000,
    estimatedReactiveFailureCost: 190000,
    conditionHistory: [
      { date: '2024-05-10', conditionScore: 84, riskScore: 24, inspector: 'Er. N. Mohan', notes: 'System healthy' },
      { date: '2026-04-18', conditionScore: 68, riskScore: 54, inspector: 'Er. N. Mohan', notes: 'Feeder breaker tripped twice during light showers' }
    ],
    history: [
      {
        id: 'EV-4058-1',
        date: '2021-05-10',
        title: 'LED Feeder Pillar 9 Commissioning',
        description: 'Installed 36 pole circuit with central astronomical timer and IoT power meter.',
        type: 'Installation',
        status: 'Completed',
        cost: 1650000,
        department: 'BESCOM Mahadevapura'
      },
      {
        id: 'EV-4058-2',
        date: '2026-04-18',
        title: 'Tripped Feeder Rectification',
        description: 'Located degraded cable joint at pole #14, applied heat-shrink waterproof resin sleeve.',
        type: 'Repair',
        status: 'Completed',
        cost: 28000,
        department: 'BESCOM Maintenance'
      }
    ]
  },
  {
    id: 'PB-6020',
    name: 'Indiranagar Ward 12 Citizen Civic Amenity Center',
    category: 'Public Building',
    ward: 'Ward 12 (Indiranagar)',
    zone: 'East Zone',
    coordinates: [12.9741, 77.6482],
    installationDate: '2020-10-02',
    currentCondition: 'Good',
    conditionScore: 84,
    riskScore: 21,
    riskLevel: 'Healthy',
    lastMaintenance: '2026-02-10',
    nextScheduledMaintenance: '2027-02-10',
    responsibleDepartment: 'BBMP Public Works & Buildings Wing',
    status: 'Operational',
    estimatedFailureWindow: '> 300 days',
    failureProbability: 14,
    criticality: 'Medium',
    recurringFailurePatterns: [
      'Minor rooftop solar inverter grid sync dips during utility voltage spikes'
    ],
    weaknessFactors: [
      { factor: 'Rooftop Waterproof Membrane Age', impact: 29 },
      { factor: 'HVAC Air Filter Loading', impact: 22 }
    ],
    recommendedAction: 'Standard annual structural audit and fire suppression system re-certification.',
    estimatedPreventiveCost: 45000,
    estimatedReactiveFailureCost: 350000,
    conditionHistory: [
      { date: '2024-02-05', conditionScore: 92, riskScore: 12, inspector: 'Er. Savita Devi', notes: 'Structure pristine' },
      { date: '2026-02-10', conditionScore: 84, riskScore: 21, inspector: 'Er. Savita Devi', notes: 'Minor terrace drain clearing required' }
    ],
    history: [
      {
        id: 'EV-6020-1',
        date: '2020-10-02',
        title: 'Civic Amenity Facility Inauguration',
        description: 'Green building certified 2-storey administrative center for citizen grievance redressal and birth/death certificates.',
        type: 'Installation',
        status: 'Completed',
        cost: 18500000,
        department: 'BBMP Engineering Wing'
      }
    ]
  },
  {
    id: 'RD-2210',
    name: '11th Cross Residential Spine',
    category: 'Road',
    ward: 'Ward 08 (Malleshwaram)',
    zone: 'West Zone',
    coordinates: [13.0075, 77.5689],
    installationDate: '2022-12-15',
    currentCondition: 'Good',
    conditionScore: 82,
    riskScore: 23,
    riskLevel: 'Healthy',
    lastMaintenance: '2026-01-20',
    nextScheduledMaintenance: '2027-01-20',
    responsibleDepartment: 'BBMP Road Infrastructure Cell',
    status: 'Operational',
    estimatedFailureWindow: '> 250 days',
    failureProbability: 16,
    criticality: 'Medium',
    recurringFailurePatterns: ['No recurring structural defects.'],
    weaknessFactors: [
      { factor: 'Tree Root Kerb Upheaval', impact: 32 },
      { factor: 'Surface Micro-texture Wear', impact: 21 }
    ],
    recommendedAction: 'Routine kerb paint refresh and drain grate leaf sweep.',
    estimatedPreventiveCost: 28000,
    estimatedReactiveFailureCost: 420000,
    conditionHistory: [
      { date: '2024-01-15', conditionScore: 90, riskScore: 15, inspector: 'Er. K. Murthy', notes: 'Excellent condition' },
      { date: '2026-01-20', conditionScore: 82, riskScore: 23, inspector: 'Er. K. Murthy', notes: 'Good condition, minor kerb shift near tree #12' }
    ],
    history: [
      {
        id: 'EV-2210-1',
        date: '2022-12-15',
        title: 'Permeable Concrete Paver Spine Laying',
        description: 'Constructed eco-friendly interlocking paver carriage with integrated percolation trenches.',
        type: 'Installation',
        status: 'Completed',
        cost: 2100000,
        department: 'BBMP Malleshwaram Division'
      }
    ]
  },
  {
    id: 'SWD-1120',
    name: 'Hebbal Lake Outflow Spillway & Canal 3',
    category: 'Stormwater Drain',
    ward: 'Ward 04 (Hebbal)',
    zone: 'North Zone',
    coordinates: [13.0410, 77.5892],
    installationDate: '2019-07-22',
    currentCondition: 'Fair',
    conditionScore: 64,
    riskScore: 59,
    riskLevel: 'Moderate',
    lastMaintenance: '2026-05-11',
    nextScheduledMaintenance: '2026-11-18',
    responsibleDepartment: 'BBMP Stormwater Drain Division',
    status: 'Operational',
    estimatedFailureWindow: '45 - 60 days',
    failureProbability: 52,
    criticality: 'High',
    recurringFailurePatterns: [
      'Water hyacinth choking spillway weir crest',
      'Bank revetment stone dislodgement from lake wave action'
    ],
    weaknessFactors: [
      { factor: 'Aquatic Weed Biomass Density', impact: 71 },
      { factor: 'Spillway Crest Scour', impact: 58 },
      { factor: 'Upstream Inflow Surge Peak', impact: 51 }
    ],
    recommendedAction: 'Harvester boat weed extraction along 300m lake periphery and cement grouting of loose stone pitchings.',
    estimatedPreventiveCost: 95000,
    estimatedReactiveFailureCost: 820000,
    conditionHistory: [
      { date: '2024-06-10', conditionScore: 79, riskScore: 31, inspector: 'Er. R. Venkatesh', notes: 'Weeds removed, good discharge' },
      { date: '2026-05-11', conditionScore: 64, riskScore: 59, inspector: 'Er. R. Venkatesh', notes: 'Hyacinth mats re-formed at spillway crest' }
    ],
    history: [
      {
        id: 'EV-1120-1',
        date: '2019-07-22',
        title: 'Spillway Weir Modernization',
        description: 'Reconstructed 15m overflow weir with reinforced gabion toe protection.',
        type: 'Installation',
        status: 'Completed',
        cost: 3800000,
        department: 'BBMP Lakes Division'
      },
      {
        id: 'EV-1120-2',
        date: '2026-05-11',
        title: 'Pre-Monsoon Weed Removal',
        description: 'Removed 28 metric tons of aquatic biomass using amphibious excavator.',
        type: 'Maintenance',
        status: 'Completed',
        cost: 120000,
        department: 'BBMP Lakes Division'
      }
    ]
  }
];

export const INITIAL_MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
    id: 'MNT-2026-891',
    assetId: 'SWD-1099',
    assetName: 'Ejipura Canal Outfall Gate & Spillway Channel',
    ward: 'Ward 15 (Koramangala)',
    category: 'Stormwater Drain',
    maintenanceType: 'Desilting',
    date: '2026-11-02',
    status: 'Scheduled',
    department: 'BBMP Stormwater Drain Division',
    technician: 'Lead Eng. Priya Natarajan',
    cost: 110000,
    notes: 'Urgent crane mobilization to free wedged counterweight flap gate before predicted monsoon rainfall.'
  },
  {
    id: 'MNT-2026-884',
    assetId: 'WL-3015',
    assetName: '14th Main High-Pressure Feeder Pipeline (500mm DI)',
    ward: 'Ward 15 (Koramangala)',
    category: 'Water Pipeline',
    maintenanceType: 'Valve Overhaul',
    date: '2026-11-03',
    status: 'Scheduled',
    department: 'BWSSB Water Supply & Sewerage Board',
    technician: 'Er. Ananya Gupta',
    cost: 140000,
    notes: 'Surge dampener valve pressure recalibration and external joint sleeve clamp reinforcement.'
  },
  {
    id: 'MNT-2026-879',
    assetId: 'SWD-1042',
    assetName: '100ft Road Primary Stormwater Culvert',
    ward: 'Ward 12 (Indiranagar)',
    category: 'Stormwater Drain',
    maintenanceType: 'Desilting',
    date: '2026-11-05',
    status: 'Scheduled',
    department: 'BBMP Stormwater Drain Division',
    technician: 'Er. Suresh Rao',
    cost: 85000,
    notes: 'High-velocity jetting truck to eliminate grease/silt barrier at 100ft Road intersection.'
  },
  {
    id: 'MNT-2026-865',
    assetId: 'RD-2081',
    assetName: 'Sampige Road Commercial Arterial (Ch. 1+200)',
    ward: 'Ward 08 (Malleshwaram)',
    category: 'Road',
    maintenanceType: 'Pothole Patching',
    date: '2026-10-24',
    status: 'In Progress',
    department: 'BBMP Road Infrastructure Cell',
    technician: 'Er. Deepak Hegde',
    cost: 95000,
    notes: 'Milling 25mm degraded asphalt and laying rapid-curing bituminous concrete.'
  },
  {
    id: 'MNT-2026-850',
    assetId: 'RD-2104',
    assetName: 'ITPL Main Avenue Technology Corridor',
    ward: 'Ward 22 (Whitefield)',
    category: 'Road',
    maintenanceType: 'Preventive Resurfacing',
    date: '2026-10-15',
    status: 'Overdue',
    department: 'BBMP Road Infrastructure Cell',
    technician: 'Er. Rajesh Gowda',
    cost: 450000,
    notes: 'Overdue by 14 days due to traffic police night-shift clearance delay.'
  },
  {
    id: 'MNT-2026-832',
    assetId: 'SL-4022',
    assetName: 'Bellary Road Smart LED Mast Cluster 4 (12 Units)',
    ward: 'Ward 04 (Hebbal)',
    category: 'Streetlight',
    maintenanceType: 'Routine Cleaning',
    date: '2026-08-20',
    status: 'Completed',
    department: 'BESCOM Electrical Grid & Lighting Division',
    technician: 'Er. Vinod Patil',
    cost: 18000,
    notes: 'Luminaire lens wipe-down, lux sensor calibration, and LoRa node firmware ping verified.',
    completionDate: '2026-08-20'
  },
  {
    id: 'MNT-2026-810',
    assetId: 'WL-3088',
    assetName: 'Cauvery Stage IV Header Line (600mm MS)',
    ward: 'Ward 18 (Rajajinagar)',
    category: 'Water Pipeline',
    maintenanceType: 'Routine Cleaning',
    date: '2026-07-14',
    status: 'Completed',
    department: 'BWSSB Transmission Division',
    technician: 'Er. C. K. Narahari',
    cost: 25000,
    notes: 'Ultrasonic thickness scan and cathodic protection potential reading logged.',
    completionDate: '2026-07-14'
  },
  {
    id: 'MNT-2026-788',
    assetId: 'SWD-1042',
    assetName: '100ft Road Primary Stormwater Culvert',
    ward: 'Ward 12 (Indiranagar)',
    category: 'Stormwater Drain',
    maintenanceType: 'Desilting',
    date: '2026-06-18',
    status: 'Completed',
    department: 'BBMP Stormwater Drain Division',
    technician: 'Er. Suresh Rao',
    cost: 95000,
    notes: 'Extracted 14 tonnes municipal silt; recommended recurring intervention before October.',
    completionDate: '2026-06-18'
  }
];

export const INITIAL_ALERTS: HighPriorityAlert[] = [
  {
    id: 'ALT-1',
    assetId: 'SWD-1099',
    assetName: 'Ejipura Canal Outfall Gate & Spillway Channel',
    ward: 'Ward 15 (Koramangala)',
    category: 'Stormwater Drain',
    riskLevel: 'Critical',
    predictedIssue: 'Gate counterweight jammed at 35% open; 94% probability of residential backflow flooding in 48-72h during rainfall',
    recommendedAction: 'Mobilize hydraulic crane to clear silt wedge and lubricate hinge assembly before Saturday precipitation',
    timeframe: '2 - 5 days',
    confidence: 94,
    timestamp: '2026-10-29 08:30 IST'
  },
  {
    id: 'ALT-2',
    assetId: 'WL-3015',
    assetName: '14th Main High-Pressure Feeder Pipeline (500mm DI)',
    ward: 'Ward 15 (Koramangala)',
    category: 'Water Pipeline',
    riskLevel: 'Critical',
    predictedIssue: 'Cavitation acoustic surge pressure exceeds 1.4 MPa; catastrophic joint burst predicted',
    recommendedAction: 'Adjust VFD soft-start ramping on booster pumps and clamp Joint #14',
    timeframe: '3 - 7 days',
    confidence: 91,
    timestamp: '2026-10-29 07:15 IST'
  },
  {
    id: 'ALT-3',
    assetId: 'SWD-1042',
    assetName: '100ft Road Primary Stormwater Culvert',
    ward: 'Ward 12 (Indiranagar)',
    category: 'Stormwater Drain',
    riskLevel: 'Critical',
    predictedIssue: 'Grease and silt blockage choking throat cross-section by 68%; chronic historical flood epicenter',
    recommendedAction: 'Deploy high-velocity suction super-sucker truck for emergency conduit scouring',
    timeframe: '6 - 12 days',
    confidence: 86,
    timestamp: '2026-10-28 16:45 IST'
  },
  {
    id: 'ALT-4',
    assetId: 'RD-2104',
    assetName: 'ITPL Main Avenue Technology Corridor',
    ward: 'Ward 22 (Whitefield)',
    category: 'Road',
    riskLevel: 'High',
    predictedIssue: 'Asphalt rutting depth reached 19mm under heavy shuttle bus routes; imminent structural sub-base collapse',
    recommendedAction: 'Apply milling and polymer modified asphalt patch before festival traffic surge',
    timeframe: '10 - 15 days',
    confidence: 81,
    timestamp: '2026-10-28 11:20 IST'
  },
  {
    id: 'ALT-5',
    assetId: 'RD-2081',
    assetName: 'Sampige Road Commercial Arterial (Ch. 1+200)',
    ward: 'Ward 08 (Malleshwaram)',
    category: 'Road',
    riskLevel: 'High',
    predictedIssue: 'Water intrusion from utility trenching weakening pavement foundation; rapid pothole formation',
    recommendedAction: 'Mastic asphalt sealing of longitudinal joints to prevent base water saturation',
    timeframe: '14 - 21 days',
    confidence: 74,
    timestamp: '2026-10-27 14:10 IST'
  }
];

export const AI_PREDICTIONS: AIPredictionItem[] = [
  {
    id: 'PRED-1099',
    assetId: 'SWD-1099',
    assetName: 'Ejipura Canal Outfall Gate & Spillway Channel',
    ward: 'Ward 15 (Koramangala)',
    category: 'Stormwater Drain',
    riskScore: 94,
    confidence: 94,
    likelyFailureType: 'Flap Gate Seizure & Reverse Lake Backflow Inundation',
    estimatedTimeframe: '2 - 5 days',
    historicalFactors: [
      'Failed in Sep 2022 during 100mm cloudburst causing 3.5ft flooding',
      'Solid waste entanglements logged 3 times in past 18 months',
      'Telemetry shows gate angle sensor static at 35 degrees during low-flow hours'
    ],
    contributingFactors: [
      { label: 'Debris Mechanical Wedging', percentage: 38 },
      { label: 'Unchecked Silt Accretion', percentage: 26 },
      { label: 'Seasonal Monsoon Inflow Forecast', percentage: 20 },
      { label: 'Hinge Metal Corrosion Gap', percentage: 16 }
    ],
    recommendedAction: 'Immediate crane-assisted desilting and counterweight bearing lubrication. Cost: ₹1.10L. Prevents an estimated ₹18.9L in emergency rescue and pavement rebuild.',
    preventiveSavings: '₹17.80 Lakhs Saved',
    previousAccuracy: '95.2% model precision across last 4 monsoon cycles'
  },
  {
    id: 'PRED-3015',
    assetId: 'WL-3015',
    assetName: '14th Main High-Pressure Feeder Pipeline (500mm DI)',
    ward: 'Ward 15 (Koramangala)',
    category: 'Water Pipeline',
    riskScore: 92,
    confidence: 91,
    likelyFailureType: 'Hydraulic Water Hammer Ductile Iron Pipe Burst',
    estimatedTimeframe: '3 - 7 days',
    historicalFactors: [
      'Similar rupture at same chainage in Dec 2021 causing 400,000L water loss',
      'Acoustic sensor picked up 3.2 kHz micro-leak resonance frequency',
      'Ultrasonic wall thickness measurement degraded to 68% of original gauge'
    ],
    contributingFactors: [
      { label: 'Pump Trip Pressure Transients', percentage: 40 },
      { label: 'Corrosive Soil Environment', percentage: 28 },
      { label: 'Pipeline Age (Installed 2016)', percentage: 18 },
      { label: 'Pavement Traffic Vibration', percentage: 14 }
    ],
    recommendedAction: 'Recalibrate booster pump VFD ramp parameters and bolt on external ductile sleeve clamp at joint 14.',
    preventiveSavings: '₹12.80 Lakhs Saved',
    previousAccuracy: '91.8% verification accuracy across BWSSB feeder tests'
  },
  {
    id: 'PRED-1042',
    assetId: 'SWD-1042',
    assetName: '100ft Road Primary Stormwater Culvert',
    ward: 'Ward 12 (Indiranagar)',
    category: 'Stormwater Drain',
    riskScore: 88,
    confidence: 86,
    likelyFailureType: 'Severe Inundation Bottleneck & Roadway Submersion',
    estimatedTimeframe: '6 - 12 days',
    historicalFactors: [
      'Waterlogging complaints IND-902, IND-1104, and IND-1420 all originated here',
      'Runoff evacuation speed fallen 58% below design capacity in last 90 days',
      'Micro-cracking on box culvert lintel detected in June inspection'
    ],
    contributingFactors: [
      { label: 'Commercial Grease & Silt Congestion', percentage: 44 },
      { label: 'Inadequate Upstream Trash Screening', percentage: 24 },
      { label: 'Urban Impervious Area Expansion', percentage: 20 },
      { label: 'Structural Lintel Micro-cracking', percentage: 12 }
    ],
    recommendedAction: 'Dispatch high-pressure water jetting trucks and issue grease-trap compliance notice to 12th Main restaurants.',
    preventiveSavings: '₹8.55 Lakhs Saved',
    previousAccuracy: '88.4% correlation with actual waterlogging telemetry'
  },
  {
    id: 'PRED-2104',
    assetId: 'RD-2104',
    assetName: 'ITPL Main Avenue Technology Corridor',
    ward: 'Ward 22 (Whitefield)',
    category: 'Road',
    riskScore: 82,
    confidence: 81,
    likelyFailureType: 'Bituminous Rutting & Structural Shear Failure',
    estimatedTimeframe: '10 - 15 days',
    historicalFactors: [
      'Traffic police notice #WFD-44 warned of vehicle zig-zagging to avoid rut troughs',
      'Heavy shuttle bus traffic (over 1,800 trips/day) exceeding design load by 22%',
      'Utility trench compaction failed moisture ingress tests'
    ],
    contributingFactors: [
      { label: 'Repeated Axle Overloading', percentage: 42 },
      { label: 'Water Seepage From Trench Cut', percentage: 28 },
      { label: 'High Ambient Asphalt Surface Temps', percentage: 16 },
      { label: 'Lack of Kerb Shoulder Confinement', percentage: 14 }
    ],
    recommendedAction: 'Night-time cold milling of 40mm wearing layer and replacement with Stone Matrix Asphalt.',
    preventiveSavings: '₹21.50 Lakhs Saved',
    previousAccuracy: '86.5% road distress prediction accuracy'
  }
];

export const WARDS_SUMMARY: WardSummary[] = [
  {
    name: 'Ward 12 (Indiranagar)',
    zone: 'East Zone',
    totalAssets: 486,
    criticalAssets: 8,
    highRiskAssets: 21,
    moderateRiskAssets: 64,
    healthyAssets: 393,
    averageRiskScore: 34.2,
    potholeVulnerabilityIndex: 42,
    monsoonFloodRiskIndex: 78
  },
  {
    name: 'Ward 15 (Koramangala)',
    zone: 'South Zone',
    totalAssets: 512,
    criticalAssets: 11,
    highRiskAssets: 28,
    moderateRiskAssets: 79,
    healthyAssets: 394,
    averageRiskScore: 38.6,
    potholeVulnerabilityIndex: 56,
    monsoonFloodRiskIndex: 86
  },
  {
    name: 'Ward 08 (Malleshwaram)',
    zone: 'West Zone',
    totalAssets: 420,
    criticalAssets: 4,
    highRiskAssets: 16,
    moderateRiskAssets: 55,
    healthyAssets: 345,
    averageRiskScore: 28.4,
    potholeVulnerabilityIndex: 48,
    monsoonFloodRiskIndex: 32
  },
  {
    name: 'Ward 04 (Hebbal)',
    zone: 'North Zone',
    totalAssets: 390,
    criticalAssets: 3,
    highRiskAssets: 12,
    moderateRiskAssets: 48,
    healthyAssets: 327,
    averageRiskScore: 26.8,
    potholeVulnerabilityIndex: 38,
    monsoonFloodRiskIndex: 54
  },
  {
    name: 'Ward 22 (Whitefield)',
    zone: 'Mahadevapura Zone',
    totalAssets: 580,
    criticalAssets: 9,
    highRiskAssets: 32,
    moderateRiskAssets: 84,
    healthyAssets: 455,
    averageRiskScore: 41.5,
    potholeVulnerabilityIndex: 82,
    monsoonFloodRiskIndex: 68
  },
  {
    name: 'Ward 31 (Jayanagar)',
    zone: 'South Zone',
    totalAssets: 454,
    criticalAssets: 2,
    highRiskAssets: 9,
    moderateRiskAssets: 42,
    healthyAssets: 401,
    averageRiskScore: 21.2,
    potholeVulnerabilityIndex: 24,
    monsoonFloodRiskIndex: 28
  }
];

export const FAILURE_TREND_DATA = {
  monthly: [
    { period: 'May 2026', historical: 28, predicted: 31, prevented: 24, efficiency: 86 },
    { period: 'Jun 2026', historical: 42, predicted: 45, prevented: 38, efficiency: 89 },
    { period: 'Jul 2026', historical: 38, predicted: 40, prevented: 35, efficiency: 91 },
    { period: 'Aug 2026', historical: 32, predicted: 34, prevented: 30, efficiency: 92 },
    { period: 'Sep 2026', historical: 26, predicted: 28, prevented: 25, efficiency: 94 },
    { period: 'Oct 2026', historical: 19, predicted: 22, prevented: 20, efficiency: 91 },
    { period: 'Nov 2026 (Pred)', historical: 0, predicted: 24, prevented: 18, efficiency: 93 },
    { period: 'Dec 2026 (Pred)', historical: 0, predicted: 16, prevented: 14, efficiency: 95 }
  ],
  weekly: [
    { period: 'Wk 39', historical: 6, predicted: 7, prevented: 6, efficiency: 92 },
    { period: 'Wk 40', historical: 8, predicted: 9, prevented: 7, efficiency: 88 },
    { period: 'Wk 41', historical: 5, predicted: 6, prevented: 5, efficiency: 94 },
    { period: 'Wk 42', historical: 4, predicted: 5, prevented: 4, efficiency: 90 },
    { period: 'Wk 43', historical: 3, predicted: 4, prevented: 3, efficiency: 95 },
    { period: 'Wk 44 (Curr)', historical: 2, predicted: 6, prevented: 5, efficiency: 91 },
    { period: 'Wk 45 (Next)', historical: 0, predicted: 8, prevented: 7, efficiency: 93 },
    { period: 'Wk 46 (Pred)', historical: 0, predicted: 5, prevented: 4, efficiency: 94 }
  ],
  yearly: [
    { period: '2022', historical: 380, predicted: 0, prevented: 110, efficiency: 72 },
    { period: '2023', historical: 340, predicted: 0, prevented: 165, efficiency: 78 },
    { period: '2024', historical: 290, predicted: 310, prevented: 240, efficiency: 85 },
    { period: '2025', historical: 245, predicted: 260, prevented: 225, efficiency: 89 },
    { period: '2026 (YTD)', historical: 185, predicted: 210, prevented: 192, efficiency: 92 }
  ]
};

export const CATEGORY_RISK_STATS = [
  { category: 'Stormwater Drain', total: 640, critical: 12, high: 34, moderate: 110, healthy: 484, avgRisk: 42.5 },
  { category: 'Road', total: 980, critical: 10, high: 45, moderate: 180, healthy: 745, avgRisk: 37.8 },
  { category: 'Water Pipeline', total: 520, critical: 8, high: 22, moderate: 76, healthy: 414, avgRisk: 31.4 },
  { category: 'Streetlight', total: 460, critical: 2, high: 11, moderate: 42, healthy: 405, avgRisk: 19.2 },
  { category: 'Bridge & Flyover', total: 112, critical: 1, high: 6, moderate: 24, healthy: 81, avgRisk: 28.6 },
  { category: 'Public Building', total: 130, critical: 1, high: 4, moderate: 18, healthy: 107, avgRisk: 18.0 }
];

// --- DEMO USERS ---

export const DEMO_CITIZEN_USERS: CitizenUser[] = [
  {
    id: 'CIT-101',
    name: 'Priya Sharma',
    email: 'priya.sharma@citizen.in',
    phone: '+91 98451 23456',
    residentialArea: '12th Main, HAL 2nd Stage, Indiranagar',
    ward: 'Ward 12 (Indiranagar)',
    municipality: 'BBMP Bengaluru'
  },
  {
    id: 'CIT-102',
    name: 'Arun Varma',
    email: 'arun.varma@citizen.in',
    phone: '+91 98452 34567',
    residentialArea: 'ITPL Main Avenue, Hope Farm',
    ward: 'Ward 22 (Whitefield)',
    municipality: 'BBMP Bengaluru'
  }
];

export const DEMO_OFFICER_USERS: OfficerUser[] = [
  {
    id: 'OFF-201',
    name: 'Er. K. Raghavan',
    employeeId: 'BBMP-ENG-8402',
    department: 'Road & Stormwater Infrastructure Cell',
    designation: 'Executive Ward Engineer',
    municipality: 'BBMP Bengaluru',
    assignedWards: ['Ward 12 (Indiranagar)', 'Ward 13 (Domlur)', 'Ward 15 (Koramangala)']
  },
  {
    id: 'OFF-202',
    name: 'Er. Ramesh Kumar',
    employeeId: 'BBMP-ENG-9104',
    department: 'Mahadevapura Zonal Infrastructure',
    designation: 'Zonal Assistant Executive Engineer',
    municipality: 'BBMP Bengaluru',
    assignedWards: ['Ward 20 (KR Puram)', 'Ward 22 (Whitefield)']
  }
];

export const MUNICIPAL_DEPARTMENTS = [
  {
    id: 'DEPT-1',
    name: 'Road Maintenance Department',
    code: 'RMD',
    head: 'Er. Suresh Hegde',
    contact: '+91 80 2266 0012',
    pendingTasks: 14,
    inProgressTasks: 8,
    resolvedTasks: 142
  },
  {
    id: 'DEPT-2',
    name: 'Drainage & Stormwater Department',
    code: 'SWD',
    head: 'Er. Anand Rao',
    contact: '+91 80 2266 0015',
    pendingTasks: 9,
    inProgressTasks: 6,
    resolvedTasks: 98
  },
  {
    id: 'DEPT-3',
    name: 'Water Supply & Sewerage (BWSSB)',
    code: 'BWSSB',
    head: 'Er. Ananya Gupta',
    contact: '+91 80 2294 5100',
    pendingTasks: 11,
    inProgressTasks: 5,
    resolvedTasks: 84
  },
  {
    id: 'DEPT-4',
    name: 'Electrical & Streetlight Department (BESCOM)',
    code: 'BESCOM',
    head: 'Er. Vinod Patil',
    contact: '+91 80 2287 3300',
    pendingTasks: 6,
    inProgressTasks: 4,
    resolvedTasks: 112
  },
  {
    id: 'DEPT-5',
    name: 'Sanitation & Solid Waste Management',
    code: 'SWM',
    head: 'Er. Meenakshi S.',
    contact: '+91 80 2266 0022',
    pendingTasks: 8,
    inProgressTasks: 3,
    resolvedTasks: 165
  },
  {
    id: 'DEPT-6',
    name: 'Public Works & Structures Department',
    code: 'PWD',
    head: 'Er. C. K. Narahari',
    contact: '+91 80 2266 0030',
    pendingTasks: 4,
    inProgressTasks: 2,
    resolvedTasks: 45
  }
];

export const INITIAL_COMPLAINTS: CitizenComplaint[] = [
  {
    id: 'CM-2026-00124',
    citizenId: 'CIT-101',
    citizenName: 'Priya Sharma',
    citizenPhone: '+91 98451 23456',
    category: 'Road damage / potholes',
    title: 'Severe cratering and tire damage outside Indiranagar Metro Station',
    description: 'A deep crater-like pothole has formed in the middle lane of 100ft Road opposite Metro Pillar 84. Two two-wheelers skidded last night. Bitumen sub-base is completely washed out.',
    severity: 'High',
    priorityScore: 84,
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      latitude: 12.9784,
      longitude: 77.6408,
      address: '100ft Road, opposite Pillar 84, Indiranagar',
      ward: 'Ward 12 (Indiranagar)',
      municipality: 'BBMP Bengaluru'
    },
    dateSubmitted: '2026-10-28 09:15 IST',
    lastUpdated: '2026-10-28 11:30 IST',
    status: 'Assigned',
    assignedDepartment: 'Road Maintenance Department',
    assignedTeam: 'East Zone Asphalt Rapid Crew 2',
    officerRemarks: 'Clustered with 7 similar citizen grievances. Scheduled for night-time cold-mix asphalt overlay.',
    clusterGroupId: 'CLUST-12-ROAD-01',
    similarReportsCount: 8,
    timeline: [
      {
        id: 'TL-1',
        status: 'Submitted',
        title: 'Complaint Registered',
        description: 'Citizen Priya Sharma submitted complaint via CityMemory app with photo evidence.',
        timestamp: '2026-10-28 09:15 IST',
        actor: 'Citizen Priya Sharma'
      },
      {
        id: 'TL-2',
        status: 'Acknowledged',
        title: 'Acknowledged by Municipal System',
        description: 'Automated receipt generated; clustered with recurring reports at 100ft Road.',
        timestamp: '2026-10-28 09:20 IST',
        actor: 'CityMemory Intelligence Core'
      },
      {
        id: 'TL-3',
        status: 'Under Review',
        title: 'Reviewed by Ward Officer',
        description: 'Assigned priority score 84/100 due to public safety hazard on primary arterial.',
        timestamp: '2026-10-28 10:45 IST',
        actor: 'Er. K. Raghavan (Ward 12 Engineer)'
      },
      {
        id: 'TL-4',
        status: 'Assigned',
        title: 'Dispatched to Road Maintenance Wing',
        description: 'Work order forwarded to East Zone Asphalt Rapid Crew 2. Material requisitioned.',
        timestamp: '2026-10-28 11:30 IST',
        actor: 'Er. K. Raghavan'
      }
    ]
  },
  {
    id: 'CM-2026-00120',
    citizenId: 'CIT-103',
    citizenName: 'Rajesh Kulkarni',
    citizenPhone: '+91 98450 44556',
    category: 'Road damage / potholes',
    title: 'Multiple rim-bending potholes on 100ft Road near 12th Main cross',
    description: 'Traffic slowing to a crawl. Vehicles swerving sharply to avoid deep road depressions.',
    severity: 'High',
    priorityScore: 82,
    images: [],
    location: {
      latitude: 12.9789,
      longitude: 77.6412,
      address: '100ft Road & 12th Main junction, Indiranagar',
      ward: 'Ward 12 (Indiranagar)',
      municipality: 'BBMP Bengaluru'
    },
    dateSubmitted: '2026-10-27 16:40 IST',
    lastUpdated: '2026-10-28 10:45 IST',
    status: 'Assigned',
    assignedDepartment: 'Road Maintenance Department',
    clusterGroupId: 'CLUST-12-ROAD-01',
    similarReportsCount: 8,
    timeline: [
      {
        id: 'TL-20-1',
        status: 'Submitted',
        title: 'Complaint Registered',
        description: 'Citizen complaint logged.',
        timestamp: '2026-10-27 16:40 IST',
        actor: 'Citizen Rajesh Kulkarni'
      },
      {
        id: 'TL-20-2',
        status: 'Assigned',
        title: 'Grouped in Road Cluster',
        description: 'Merged into recurring road damage priority cluster #CLUST-12-ROAD-01.',
        timestamp: '2026-10-28 10:45 IST',
        actor: 'Er. K. Raghavan'
      }
    ]
  },
  {
    id: 'CM-2026-00115',
    citizenId: 'CIT-101',
    citizenName: 'Priya Sharma',
    citizenPhone: '+91 98451 23456',
    category: 'Drainage blockage',
    title: 'Stormwater drain overflow on 10th Main due to garbage blockage',
    description: 'Black sludge and plastic bottles spilling onto the footpath after brief rainfall. Foul odor affecting pedestrians.',
    severity: 'Critical',
    priorityScore: 89,
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      latitude: 12.9772,
      longitude: 77.6395,
      address: '10th Main Road, near Corporation Bank, Indiranagar',
      ward: 'Ward 12 (Indiranagar)',
      municipality: 'BBMP Bengaluru'
    },
    dateSubmitted: '2026-10-26 14:10 IST',
    lastUpdated: '2026-10-29 08:00 IST',
    status: 'In Progress',
    assignedDepartment: 'Drainage & Stormwater Department',
    assignedTeam: 'BBMP Desilting Super-Sucker Unit 4',
    officerRemarks: 'High-velocity jetting vehicle deployed to clear choked culvert throat.',
    clusterGroupId: 'CLUST-12-DRAIN-02',
    similarReportsCount: 5,
    timeline: [
      {
        id: 'TL-15-1',
        status: 'Submitted',
        title: 'Complaint Registered',
        description: 'Submitted by citizen Priya Sharma with photo proof.',
        timestamp: '2026-10-26 14:10 IST',
        actor: 'Citizen Priya Sharma'
      },
      {
        id: 'TL-15-2',
        status: 'Under Review',
        title: 'Flagged for High Flood Risk',
        description: 'Linked with culvert asset SWD-1042 digital memory.',
        timestamp: '2026-10-26 15:30 IST',
        actor: 'Er. K. Raghavan'
      },
      {
        id: 'TL-15-3',
        status: 'In Progress',
        title: 'Desilting Vehicle Dispatched',
        description: 'Super-sucker suction vehicle on site clearing compacted silt.',
        timestamp: '2026-10-29 08:00 IST',
        actor: 'Supervising Eng. Suresh Rao'
      }
    ]
  },
  {
    id: 'CM-2026-00098',
    citizenId: 'CIT-101',
    citizenName: 'Priya Sharma',
    citizenPhone: '+91 98451 23456',
    category: 'Streetlight malfunction',
    title: 'Dark stretch on 5th Cross residential lane due to 3 fused LED lamps',
    description: 'Streetlamps #12, #13, and #14 have not been turning on for 4 days. Women residents feel unsafe walking at night.',
    severity: 'Medium',
    priorityScore: 58,
    images: [],
    location: {
      latitude: 12.9755,
      longitude: 77.6420,
      address: '5th Cross, 1st Stage Indiranagar',
      ward: 'Ward 12 (Indiranagar)',
      municipality: 'BBMP Bengaluru'
    },
    dateSubmitted: '2026-10-20 19:30 IST',
    lastUpdated: '2026-10-22 17:00 IST',
    status: 'Resolved',
    assignedDepartment: 'Electrical & Streetlight Department (BESCOM)',
    assignedTeam: 'BESCOM Line Staff Indiranagar',
    officerRemarks: 'Luminaires replaced under annual maintenance contract. Verified by evening lux test.',
    resolutionNotes: 'Replaced 3 burnt driver modules and refreshed wiring harness. Photometrics verified at 25 lux nominal.',
    timeline: [
      {
        id: 'TL-98-1',
        status: 'Submitted',
        title: 'Complaint Logged',
        description: 'Reported by Priya Sharma.',
        timestamp: '2026-10-20 19:30 IST',
        actor: 'Citizen Priya Sharma'
      },
      {
        id: 'TL-98-2',
        status: 'In Progress',
        title: 'Maintenance Crew Assigned',
        description: 'BESCOM technician Vinod Patil assigned.',
        timestamp: '2026-10-21 11:00 IST',
        actor: 'BESCOM Operations'
      },
      {
        id: 'TL-98-3',
        status: 'Resolved',
        title: 'Lamps Replaced & Tested',
        description: 'Luminaires operational; citizen notified.',
        timestamp: '2026-10-22 17:00 IST',
        actor: 'Er. Vinod Patil'
      }
    ]
  },
  {
    id: 'CM-2026-00108',
    citizenId: 'CIT-104',
    citizenName: 'Karthik Raman',
    citizenPhone: '+91 98453 88990',
    category: 'Water leakage',
    title: 'High pressure drinking water leaking from underground joint',
    description: 'Water gushing out from pavement edge onto 14th Main Koramangala. Clean potable water wasting rapidly.',
    severity: 'Critical',
    priorityScore: 91,
    images: [],
    location: {
      latitude: 12.9344,
      longitude: 77.6254,
      address: '14th Main, near 4th Block Park, Koramangala',
      ward: 'Ward 15 (Koramangala)',
      municipality: 'BBMP Bengaluru'
    },
    dateSubmitted: '2026-10-27 07:15 IST',
    lastUpdated: '2026-10-28 14:00 IST',
    status: 'In Progress',
    assignedDepartment: 'Water Supply & Sewerage (BWSSB)',
    assignedTeam: 'BWSSB Emergency Leak Detection Squad',
    officerRemarks: 'Corresponds with pipeline asset WL-3015 high-pressure acoustic sensor alarm.',
    clusterGroupId: 'CLUST-15-WATER-01',
    similarReportsCount: 4,
    timeline: [
      {
        id: 'TL-108-1',
        status: 'Submitted',
        title: 'Emergency Leak Logged',
        description: 'Citizen report matched with BWSSB acoustic sensor.',
        timestamp: '2026-10-27 07:15 IST',
        actor: 'Citizen Karthik Raman'
      },
      {
        id: 'TL-108-2',
        status: 'In Progress',
        title: 'Sleeve Clamp Applied',
        description: 'Excavation team located pinhole burst on 500mm DI line.',
        timestamp: '2026-10-28 14:00 IST',
        actor: 'Er. Ananya Gupta'
      }
    ]
  },
  {
    id: 'CM-2026-00130',
    citizenId: 'CIT-102',
    citizenName: 'Arun Varma',
    citizenPhone: '+91 98452 34567',
    category: 'Road damage / potholes',
    title: 'Heavy bus rutting & dangerous asphalt depression along ITPL Main Road',
    description: 'Vehicles swerving to avoid 15cm depression. Tech shuttle buses bottoming out. Severe congestion.',
    severity: 'High',
    priorityScore: 82,
    images: [],
    location: {
      latitude: 12.9865,
      longitude: 77.7289,
      address: 'ITPL Main Avenue, near Metro Pier 114, Whitefield',
      ward: 'Ward 22 (Whitefield)',
      municipality: 'BBMP Bengaluru'
    },
    dateSubmitted: '2026-10-28 10:00 IST',
    lastUpdated: '2026-10-28 10:00 IST',
    status: 'Submitted',
    officerRemarks: 'Awaiting review by Mahadevapura Zonal Officer.',
    clusterGroupId: 'CLUST-22-ROAD-01',
    similarReportsCount: 6,
    timeline: [
      {
        id: 'TL-130-1',
        status: 'Submitted',
        title: 'Complaint Registered',
        description: 'Citizen Arun Varma registered road rutting hazard.',
        timestamp: '2026-10-28 10:00 IST',
        actor: 'Citizen Arun Varma'
      }
    ]
  }
];

export const INITIAL_CLUSTERS: ComplaintCluster[] = [
  {
    id: 'CLUST-12-ROAD-01',
    title: 'Recurring Pothole & Asphalt Failure Cluster',
    category: 'Road damage / potholes',
    ward: 'Ward 12 (Indiranagar)',
    municipality: 'BBMP Bengaluru',
    approxLocation: '100ft Road Corridor (Metro Pillars 78 to 92)',
    coordinates: [12.9784, 77.6408],
    reportCount: 8,
    complaintIds: ['CM-2026-00124', 'CM-2026-00120'],
    firstReportedDate: '3 days ago',
    latestReportedDate: 'Today (09:15 AM)',
    priorityScore: 88,
    priorityLevel: 'Critical',
    recommendedAction: 'Conduct immediate mechanized milling and 50mm polymer modified asphalt resurfacing; inspect sub-base water percolation.',
    status: 'In Progress'
  },
  {
    id: 'CLUST-12-DRAIN-02',
    title: 'Primary Culvert Silt & Debris Congestion',
    category: 'Drainage blockage',
    ward: 'Ward 12 (Indiranagar)',
    municipality: 'BBMP Bengaluru',
    approxLocation: '10th & 12th Main Low-Lying Stormwater Drain',
    coordinates: [12.9772, 77.6395],
    reportCount: 5,
    complaintIds: ['CM-2026-00115'],
    firstReportedDate: '4 days ago',
    latestReportedDate: 'Yesterday',
    priorityScore: 89,
    priorityLevel: 'Critical',
    recommendedAction: 'Deploy high-velocity desilting jetting trucks before forecasted 45mm/hr rain.',
    status: 'In Progress'
  },
  {
    id: 'CLUST-15-WATER-01',
    title: 'Feeder Main Cavitation & Joint Weeping',
    category: 'Water leakage',
    ward: 'Ward 15 (Koramangala)',
    municipality: 'BBMP Bengaluru',
    approxLocation: '14th Main Feeder Corridor',
    coordinates: [12.9344, 77.6254],
    reportCount: 4,
    complaintIds: ['CM-2026-00108'],
    firstReportedDate: '2 days ago',
    latestReportedDate: 'Yesterday',
    priorityScore: 91,
    priorityLevel: 'Critical',
    recommendedAction: 'Reinforce joint sleeve clamp and check pump surge relief valves.',
    status: 'In Progress'
  },
  {
    id: 'CLUST-22-ROAD-01',
    title: 'Tech Corridor Rutting & Axle Fatigue',
    category: 'Road damage / potholes',
    ward: 'Ward 22 (Whitefield)',
    municipality: 'BBMP Bengaluru',
    approxLocation: 'ITPL Main Avenue Corridor',
    coordinates: [12.9865, 77.7289],
    reportCount: 6,
    complaintIds: ['CM-2026-00130'],
    firstReportedDate: '5 days ago',
    latestReportedDate: 'Today',
    priorityScore: 82,
    priorityLevel: 'High',
    recommendedAction: 'Night-time cold milling and Stone Matrix Asphalt overlay.',
    status: 'Pending Review'
  }
];

