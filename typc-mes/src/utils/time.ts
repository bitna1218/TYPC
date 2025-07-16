export const addZStringOnTimeString = (timeString: string): string => {
  // Z가 없으면 시간 문자열 끝에 Z를 추가
  return timeString.endsWith('Z') ? timeString : `${timeString}Z`;
};
