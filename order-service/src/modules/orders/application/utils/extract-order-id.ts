export function extractOrderId(data: unknown): string | undefined {
  if (
    typeof data === 'object' &&
    data !== null &&
    'orderId' in data &&
    typeof (data as { orderId: unknown }).orderId === 'string'
  ) {
    return (data as { orderId: string }).orderId;
  }
  return undefined;
}
