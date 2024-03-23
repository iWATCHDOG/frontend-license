declare namespace RootType {
  interface NotifyResponse {
    id: number;
    title: string;
    content: string;
    type: number;
  }

  interface NotifyRequest {
    title: string;
    content: string;
    type: number;
  }

  interface CaptchaResult {
    ret: number;
    ticket: string;
    CaptchaAppId?: number;
    bizState?: string;
    randstr: string;
  }

  interface Blacklist {
    id: number;
    ip: string;
    log: number;
    reason: string;
    createTime: Date;
    updateTime: Date;
  }
}