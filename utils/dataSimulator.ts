import type { ThreatEvent, DeviceStatus, FirewallAlert, DarkWebThreat, Incident } from "../types/security"

const THREAT_TYPES = ["Malware", "DoS", "Spoofing", "Access Violation", "Port Scan", "Brute Force"] as const
const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"] as const
const DEVICE_TYPES = [
  "Solar Inverter",
  "Transformer",
  "SCADA",
  "Smart Meter",
  "Gateway",
  "HMI",
  "RTU",
  "PLC",
  "Weather Station",
  "Energy Storage",
] as const

const LOCATIONS = [
  { country: "China", city: "Beijing", lat: 39.9042, lng: 116.4074 },
  { country: "Russia", city: "Moscow", lat: 55.7558, lng: 37.6176 },
  { country: "USA", city: "New York", lat: 40.7128, lng: -74.006 },
  { country: "Iran", city: "Tehran", lat: 35.6892, lng: 51.389 },
  { country: "North Korea", city: "Pyongyang", lat: 39.0392, lng: 125.7625 },
  { country: "Brazil", city: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { country: "India", city: "Mumbai", lat: 19.076, lng: 72.8777 },
]

const DEVICE_NAMES = [
  "INV-001",
  "INV-002",
  "TRANS-A1",
  "TRANS-B2",
  "SCADA-MAIN",
  "SCADA-BACKUP",
  "METER-001",
  "METER-002",
  "METER-003",
  "GW-NORTH",
  "GW-SOUTH",
  "HMI-CTRL1",
  "RTU-FIELD1",
  "RTU-FIELD2",
  "PLC-MAIN",
  "WEATHER-01",
  "STORAGE-BANK1",
]

export class SecurityDataSimulator {
  private threatEvents: ThreatEvent[] = []
  private devices: DeviceStatus[] = []
  private firewallAlerts: FirewallAlert[] = []
  private darkWebThreats: DarkWebThreat[] = []
  private incidents: Incident[] = []

  constructor() {
    this.initializeDevices()
    this.generateHistoricalData()
  }

  private initializeDevices() {
    DEVICE_NAMES.forEach((name, index) => {
      this.devices.push({
        id: `device-${index}`,
        name,
        type: DEVICE_TYPES[index % DEVICE_TYPES.length],
        status:
          Math.random() > 0.1 ? "Online" : (["Warning", "Critical", "Offline"][Math.floor(Math.random() * 3)] as any),
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
        authAttempts: Math.floor(Math.random() * 50),
        failedLogins: Math.floor(Math.random() * 10),
        location: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      })
    })
  }

  private generateHistoricalData() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Generate threat events
    for (let i = 0; i < 500; i++) {
      const timestamp = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()))
      this.threatEvents.push(this.generateThreatEvent(timestamp))
    }

    // Generate firewall alerts
    for (let i = 0; i < 1000; i++) {
      const timestamp = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()))
      this.firewallAlerts.push(this.generateFirewallAlert(timestamp))
    }

    // Generate dark web threats
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()))
      this.darkWebThreats.push(this.generateDarkWebThreat(timestamp))
    }

    // Generate incidents
    for (let i = 0; i < 25; i++) {
      const timestamp = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()))
      this.incidents.push(this.generateIncident(timestamp))
    }
  }

  private generateThreatEvent(timestamp: Date): ThreatEvent {
    const type = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)]

    // More realistic severity distribution: 60% Low/Medium, 30% High, 10% Critical
    const severityRandom = Math.random()
    let severity: string
    if (severityRandom < 0.3) severity = "Low"
    else if (severityRandom < 0.6) severity = "Medium"
    else if (severityRandom < 0.9) severity = "High"
    else severity = "Critical"

    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
    const device = DEVICE_NAMES[Math.floor(Math.random() * DEVICE_NAMES.length)]
    const deviceType = DEVICE_TYPES[Math.floor(Math.random() * DEVICE_TYPES.length)]

    const suggestions = this.generateSuggestions(type, severity)
    const riskScore = this.calculateRiskScore(type, severity)

    return {
      id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      type,
      severity: severity as any,
      sourceIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      targetDevice: device,
      deviceType,
      location,
      description: this.generateThreatDescription(type, device),
      status: ["Active", "Investigating", "Resolved", "Blocked"][Math.floor(Math.random() * 4)] as any,
      riskScore,
      suggestions,
    }
  }

  private generateFirewallAlert(timestamp: Date): FirewallAlert {
    const actions = ["BLOCK", "ALLOW", "DROP"] as const
    const protocols = ["TCP", "UDP", "ICMP"] as const

    return {
      id: `fw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      action: actions[Math.floor(Math.random() * actions.length)],
      sourceIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: [22, 23, 80, 443, 502, 1883, 2404, 8080][Math.floor(Math.random() * 8)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      rule: `RULE-${Math.floor(Math.random() * 100)}`,
      severity: SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)],
    }
  }

  private generateDarkWebThreat(timestamp: Date): DarkWebThreat {
    const types = [
      "Credential Dump",
      "Exploit Kit",
      "Targeted Campaign",
      "Malware Sample",
      "Vulnerability Intel",
    ] as const
    const type = types[Math.floor(Math.random() * types.length)]

    return {
      id: `dw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      type,
      target: "Energy Sector",
      severity: SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)],
      description: this.generateDarkWebDescription(type),
      source: ["TOR Market", "Underground Forum", "Telegram Channel", "Discord Server"][Math.floor(Math.random() * 4)],
      indicators: this.generateIndicators(type),
    }
  }

  private generateIncident(timestamp: Date): Incident {
    const statuses = ["Open", "In Progress", "Resolved", "Closed"] as const

    return {
      id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: this.generateIncidentTitle(),
      description: "Automated incident created from threat detection system",
      severity: SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignee: ["SOC Analyst 1", "SOC Analyst 2", "Security Engineer", "Incident Commander"][
        Math.floor(Math.random() * 4)
      ],
      createdAt: timestamp,
      updatedAt: new Date(timestamp.getTime() + Math.random() * 86400000),
      relatedEvents: [],
      actions: ["Initial assessment completed", "Containment measures applied", "Investigation ongoing"],
    }
  }

  private generateSuggestions(type: string, severity: string): string[] {
    const baseSuggestions = {
      Malware: ["Run full system scan", "Isolate affected device", "Update antivirus signatures"],
      DoS: ["Enable rate limiting", "Block source IP", "Scale up resources"],
      Spoofing: ["Verify device certificates", "Enable MAC address filtering", "Review authentication logs"],
      "Access Violation": ["Reset user credentials", "Review access permissions", "Enable MFA"],
      "Port Scan": ["Block scanning IP", "Review firewall rules", "Monitor for follow-up attacks"],
      "Brute Force": ["Lock user account", "Implement account lockout policy", "Enable CAPTCHA"],
    }

    const suggestions = baseSuggestions[type as keyof typeof baseSuggestions] || [
      "Investigate further",
      "Monitor closely",
    ]

    if (severity === "Critical") {
      suggestions.unshift("Notify SOC immediately", "Escalate to security team")
    }

    return suggestions
  }

  private calculateRiskScore(type: string, severity: string): number {
    const typeScores = {
      Malware: 8,
      DoS: 7,
      Spoofing: 6,
      "Access Violation": 9,
      "Port Scan": 4,
      "Brute Force": 7,
    }

    const severityMultipliers = {
      Low: 0.25,
      Medium: 0.5,
      High: 0.75,
      Critical: 1.0,
    }

    const baseScore = typeScores[type as keyof typeof typeScores] || 5
    const multiplier = severityMultipliers[severity as keyof typeof severityMultipliers]

    return Math.min(10, Math.round(baseScore * multiplier * 10) / 10)
  }

  private generateThreatDescription(type: string, device: string): string {
    const descriptions = {
      Malware: `Suspicious executable detected on ${device}`,
      DoS: `High volume of requests targeting ${device}`,
      Spoofing: `MAC address spoofing attempt detected on ${device}`,
      "Access Violation": `Unauthorized access attempt to ${device}`,
      "Port Scan": `Port scanning activity detected targeting ${device}`,
      "Brute Force": `Multiple failed login attempts on ${device}`,
    }

    return descriptions[type as keyof typeof descriptions] || `Security event detected on ${device}`
  }

  private generateDarkWebDescription(type: string): string {
    const descriptions = {
      "Credential Dump": "Energy sector credentials found in underground marketplace",
      "Exploit Kit": "New exploit targeting SCADA systems discovered",
      "Targeted Campaign": "APT group planning attacks on renewable energy infrastructure",
      "Malware Sample": "Industrial control system malware sample identified",
      "Vulnerability Intel": "Zero-day vulnerability in energy management systems reported",
    }

    return descriptions[type as keyof typeof descriptions] || "Dark web intelligence gathered"
  }

  private generateIndicators(type: string): string[] {
    const indicators = {
      "Credential Dump": ["admin@solarplant.com", "scada_user", "maintenance_acc"],
      "Exploit Kit": ["CVE-2023-1234", "modbus_exploit.py", "scada_backdoor.exe"],
      "Targeted Campaign": ["APT-Energy", "Operation SolarStorm", "GreenGrid Campaign"],
      "Malware Sample": ["SHA256: abc123...", "C2: malicious-domain.com", "Port: 4444"],
      "Vulnerability Intel": ["CVE-2023-5678", "Schneider Electric", "Remote Code Execution"],
    }

    return indicators[type as keyof typeof indicators] || ["No specific indicators"]
  }

  private generateIncidentTitle(): string {
    const titles = [
      "Suspicious Network Activity Detected",
      "Multiple Failed Authentication Attempts",
      "Potential Malware Infection",
      "Unauthorized Access Attempt",
      "DDoS Attack in Progress",
      "Critical System Offline",
      "Security Policy Violation",
      "Anomalous Device Behavior",
    ]

    return titles[Math.floor(Math.random() * titles.length)]
  }

  // Public methods for real-time updates
  public generateNewThreatEvent(): ThreatEvent {
    // Only generate new threat 20% of the time to make it more realistic
    if (Math.random() > 0.2) return null

    const event = this.generateThreatEvent(new Date())
    this.threatEvents.unshift(event)

    // Keep only last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    this.threatEvents = this.threatEvents.filter((e) => e.timestamp > thirtyDaysAgo)

    return event
  }

  public generateNewFirewallAlert(): FirewallAlert {
    // Only generate new alert 40% of the time
    if (Math.random() > 0.4) return null

    const alert = this.generateFirewallAlert(new Date())
    this.firewallAlerts.unshift(alert)

    // Keep only last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    this.firewallAlerts = this.firewallAlerts.filter((a) => a.timestamp > thirtyDaysAgo)

    return alert
  }

  public updateDeviceStatus() {
    this.devices.forEach((device) => {
      if (Math.random() < 0.1) {
        // 10% chance of status change
        const statuses = ["Online", "Warning", "Critical", "Offline"] as const
        device.status = statuses[Math.floor(Math.random() * statuses.length)]
        device.lastSeen = new Date()
      }

      if (Math.random() < 0.05) {
        // 5% chance of failed login
        device.failedLogins += 1
        device.authAttempts += 1
      }
    })
  }

  // Getters
  public getThreatEvents(): ThreatEvent[] {
    return [...this.threatEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  public getDevices(): DeviceStatus[] {
    return [...this.devices]
  }

  public getFirewallAlerts(): FirewallAlert[] {
    return [...this.firewallAlerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  public getDarkWebThreats(): DarkWebThreat[] {
    return [...this.darkWebThreats].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  public getIncidents(): Incident[] {
    return [...this.incidents].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Export functionality
  public exportData(type: "threats" | "devices" | "firewall" | "darkweb" | "incidents" | "all") {
    const data = {
      threats: type === "threats" || type === "all" ? this.threatEvents : undefined,
      devices: type === "devices" || type === "all" ? this.devices : undefined,
      firewall: type === "firewall" || type === "all" ? this.firewallAlerts : undefined,
      darkweb: type === "darkweb" || type === "all" ? this.darkWebThreats : undefined,
      incidents: type === "incidents" || type === "all" ? this.incidents : undefined,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `security-data-${type}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
