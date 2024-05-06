export default function ensureError(error: any): Error {
  if (error instanceof Error) {
    return error;
  }
  if (error.message) {
    return new Error(error.message);
  }
  return new Error('An unknown error occurred');
}
