export const MESSAGING_HEALTH = Symbol('MESSAGING_HEALTH');

export interface MessagingHealth {
  isConnected(): boolean;
}
