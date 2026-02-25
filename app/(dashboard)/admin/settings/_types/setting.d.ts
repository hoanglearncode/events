export interface General {
  systemName: string;
  systemEmail: string;
  systemTitle: string;
  note?: string;
  systemDescription: string;
  systemLogo?: string;
  maintainMode: boolean;
  allowRegister: boolean;
}

export interface Recruitment {
  timeReset: string;
  freeCounter: number;
  viewProfile: boolean;
  approval: boolean;
}

export interface Content {
  allowComment: boolean;
  blacklistKeywords: string[];
}

export interface Authentication {
  twoFactor: boolean;
  emailVerification: boolean;
  tokenLifetime: string;
}

export interface PaymentGatewayConfig {
  gatewayCode: string;
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
    measurementId: string; // G-XXXXXXXXXX
    verified: boolean;
    verifiedAt?: string; // ISO date
  };
}

export interface OAuthIntegration {
  google: OAuthProvider;
  facebook: OAuthProvider;
}

export interface OAuthProvider {
  clientId: string; // encrypted
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

export interface SystemSetting {
  id: number;
  version: string;
  active: boolean;
  note: string;
  createdBy: string;
  createdAt: string;
  general: General;
  recruitment: Recruitment;
  content: Content;
  authentication: Authentication;
  paymentGateways: PaymentGateway[];
  oauthProviders: OAuthProviderItem[];
  email: EmailIntegration;
  analytics: Analytics;
  integrationMeta: IntegrationMeta;
}

export interface SettingVersion {
  id: number;
  version: string;
  active: boolean;
  note: string;
  createdBy: string;
  createdAt: string;
}
