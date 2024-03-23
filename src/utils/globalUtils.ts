let ping = 0;
let userCount = 0;
let logCount = 0;
let securityCount = 0;
let blacklistCount = 0;


export function getPingNumber() {
  return ping;
}

export function setPingNumber(p: number) {
  ping = p;
}

export function getUserCount() {
  return userCount;
}

export function setUserCount(p: number) {
  userCount = p;
}

export function getLogCount() {
  return logCount;
}

export function setLogCount(p: number) {
  logCount = p;
}

export function getSecurityCount() {
  return securityCount;
}

export function setSecurityCount(p: number) {
  securityCount = p;
}

export function getBlacklistCount() {
  return blacklistCount;
}

export function setBlacklistCount(p: number) {
  blacklistCount = p;
}