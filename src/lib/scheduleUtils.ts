import { schedule, ScheduleRow } from '../constants/schedule';
import { parse, set, addMinutes, isBefore, isAfter, differenceInSeconds } from 'date-fns';

export interface ProgramInfo {
  title: string;
  startTime: Date;
  endTime: Date;
  timeRange: string;
}

const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function parseProgramTime(timeStr: string, baseDate: Date): { start: Date; end: Date } {
  const [startStr, endStr] = timeStr.split(' - ').map(s => s.trim());
  
  const parseHour = (s: string) => {
    // Handles "6H", "8H30", "00H"
    const match = s.match(/(\d+)H(\d+)?/);
    if (!match) return { hours: 0, minutes: 0 };
    return {
      hours: parseInt(match[1]),
      minutes: match[2] ? parseInt(match[2]) : 0
    };
  };

  const startParts = parseHour(startStr);
  const endParts = parseHour(endStr);

  let startDate = set(baseDate, { hours: startParts.hours, minutes: startParts.minutes, seconds: 0, milliseconds: 0 });
  let endDate = set(baseDate, { hours: endParts.hours, minutes: endParts.minutes, seconds: 0, milliseconds: 0 });

  // Handle midnight wrap-around (e.g., 23H - 00H)
  if (isBefore(endDate, startDate) || (endParts.hours === 0 && endParts.minutes === 0)) {
    endDate = set(endDate, { date: baseDate.getDate() + 1 });
  }

  return { start: startDate, end: endDate };
}

export function getCurrentAndNextProgram(): { current: ProgramInfo | null; next: ProgramInfo | null } {
  const now = new Date();
  const dayName = dayNames[now.getDay()];
  
  let current: ProgramInfo | null = null;
  let next: ProgramInfo | null = null;

  const todayPrograms: ProgramInfo[] = schedule.map(row => {
    const { start, end } = parseProgramTime(row.time, now);
    const title = row[dayName as keyof ScheduleRow] as string;
    return { title, startTime: start, endTime: end, timeRange: row.time };
  }).filter(p => p.title !== '-');

  // Find current
  current = todayPrograms.find(p => isAfter(now, p.startTime) && isBefore(now, p.endTime)) || null;

  // Find next (could be today or early tomorrow)
  const futureToday = todayPrograms.filter(p => isAfter(p.startTime, now));
  if (futureToday.length > 0) {
    next = futureToday[0];
  } else {
    // Check tomorrow's first program
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayName = dayNames[tomorrow.getDay()];
    const tomorrowPrograms = schedule.map(row => {
      const { start, end } = parseProgramTime(row.time, tomorrow);
      const title = row[tomorrowDayName as keyof ScheduleRow] as string;
      return { title, startTime: start, endTime: end, timeRange: row.time };
    }).filter(p => p.title !== '-');
    
    if (tomorrowPrograms.length > 0) {
      next = tomorrowPrograms[0];
    }
  }

  return { current, next };
}
