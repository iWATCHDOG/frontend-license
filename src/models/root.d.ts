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
}