export function normalizePort(port: any): number {
  if (typeof port === 'number' && port >= 0) {
    return port;
  } else if (typeof port === 'number' && port < 0) {
    return 3000;
  } else if (isNaN(parseInt(port))) {
    return 3000;
  } else {
    return parseInt(port);
  }
}
