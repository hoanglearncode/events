

export interface General {
    systemName: string;
    systemEmail: string;
    systemTitle: string;
    systemDescription: string;
    maintainMode: boolean;
    allowRegister: boolean;
}

export interface Recruitment {
    timeReset: number;
    freeCounter: number;
    isViewProfile: boolean;
}

export interface Content {
    allowComment: boolean;
    blackListKey: string[];
}

export interface Authentication {
    twoFactor: boolean;
    emailVerification: boolean;
    lifeTimeOfToken: number;
}

export interface Payment {

}

export interface Integration {
    email: {
        username: string;
        password: string;
        host: string;
        port: string;
    }
    social: {
        id: string;
    }
    payment: {
        key: string;
        secret: string;
    }
}