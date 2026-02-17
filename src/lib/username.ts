const adjectives = [
  "swift", "bright", "calm", "bold", "clever", "daring", "eager", "fierce",
  "gentle", "happy", "keen", "lively", "merry", "noble", "polite", "quiet",
  "rapid", "sharp", "witty", "zesty",
];

const animals = [
  "otter", "falcon", "panda", "wolf", "fox", "owl", "lynx", "hawk",
  "bear", "dolphin", "raven", "tiger", "eagle", "koala", "deer", "seal",
  "crane", "bison", "heron", "finch",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function generateUsername(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${pick(adjectives)}-${pick(animals)}-${num}`;
}

const STORAGE_KEY = "zibawa-chat-username";

export function getStoredUsername(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function storeUsername(name: string): void {
  localStorage.setItem(STORAGE_KEY, name);
}
