
export interface General {
    systemName: string;
    systemEmail: string;
    systemTitle: string;
    systemDescription: string;
    maintainMode: boolean;
    allowRegister: boolean;
}

export interface Recruitment {
    timeReset: string;
    freeCounter: number;
    isViewProfile: boolean;
    isApproval: boolean;
}

export interface Content {
    allowComment: boolean;
    blackListKey: string[];
}

export interface Authentication {
    twoFactor: boolean;
    emailVerification: boolean;
    lifeTimeOfToken: string;
}

export interface PaymentGatewayConfig {
  key: string;
  name: string;
  enabled: boolean;
  isDefault: boolean;
}

export interface EmailIntegration {
  username: string;
  password: string; // encrypted
  host: string;
  port: string;
}

export interface AnalyticsIntegration {
  ga4: {
    measurementId: string;     // G-XXXXXXXXXX
    verified: boolean;
    verifiedAt?: string;       // ISO date
  };
}


export interface OAuthIntegration {
  google: OAuthProvider;
  facebook: OAuthProvider;
}

export interface OAuthProvider {
  clientId: string;      // encrypted
  enabled: boolean;
  verified: boolean;
  lastUpdated?: string;
}

export interface IntegrationMeta {
  encrypted: boolean;
  managedBy: "SYSTEM" | "SECRET_MANAGER" | "ADMIN";
  updatedBy?: string;
  updatedAt?: string;
}



export interface Integration {
  email: EmailIntegration;
  analytics: AnalyticsIntegration;
  oauth: OAuthIntegration;
  meta: IntegrationMeta;
}
