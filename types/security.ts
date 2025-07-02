export interface ThreatEvent {
  id: string
  timestamp: Date
  type: "Malware" | "DoS" | "Spoofing" | "Access Violation" | "Port Scan" | "Brute Force"
  severity: "Low" | "Medium" | "High" | "Critical"
  sourceIP: string
  targetDevice: string
  deviceType: string
  location: {
    country: string
    city: string
    lat: number
    lng: number
  }
  description: string
  status: "Active" | "Investigating" | "Resolved" | "Blocked"
  riskScore: number
  suggestions: string[]
}

export interface DeviceStatus {
  id: string
  name: string
  type:
    | "Solar Inverter"
    | "Transformer"
    | "SCADA"
    | "Smart Meter"
    | "Gateway"
    | "HMI"
    | "RTU"
    | "PLC"
    | "Weather Station"
    | "Energy Storage"
  status: "Online" | "Offline" | "Warning" | "Critical"
  lastSeen: Date
  authAttempts: number
  failedLogins: number
  location: string
  ipAddress: string
}

export interface FirewallAlert {
  id: string
  timestamp: Date
  action: "BLOCK" | "ALLOW" | "DROP"
  sourceIP: string
  destIP: string
  port: number
  protocol: "TCP" | "UDP" | "ICMP"
  rule: string
  severity: "Low" | "Medium" | "High" | "Critical"
}

export interface DarkWebThreat {
  id: string
  timestamp: Date
  type: "Credential Dump" | "Exploit Kit" | "Targeted Campaign" | "Malware Sample" | "Vulnerability Intel"
  target: string
  severity: "Low" | "Medium" | "High" | "Critical"
  description: string
  source: string
  indicators: string[]
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  assignee: string
  createdAt: Date
  updatedAt: Date
  relatedEvents: string[]
  actions: string[]
}
