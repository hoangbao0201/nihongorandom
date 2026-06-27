export interface ListeningTimeQuestion {
  hours: number;
  minutes: number;
  display: string;
  speakText: string;
}

export function formatTimeAnswer(hours: number, minutes: number): string {
  return `${hours}h${minutes}`;
}

export function normalizeTimeAnswer(value: string): string | null {
  const trimmed = value.trim().toLowerCase().replace(/\s+/g, "");
  const match = trimmed.match(/^(\d{1,2})h(\d{1,2})$/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return formatTimeAnswer(hours, minutes);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildSpeakText(hours: number, minutes: number): string {
  if (minutes === 0) {
    return `${hours}時`;
  }

  return `${hours}時${minutes}分`;
}

export function buildListeningTimeQuestion(): ListeningTimeQuestion {
  const hours = randomInt(1, 12);
  const minutes = randomInt(0, 59);

  return {
    hours,
    minutes,
    display: formatTimeAnswer(hours, minutes),
    speakText: buildSpeakText(hours, minutes),
  };
}
