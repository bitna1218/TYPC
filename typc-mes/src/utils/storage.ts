/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * localStorage 관련 유틸 클래스
 * localStorage에 저장되는 값의 키는 constants/localStorage.ts에 정의된다.(cmd + p로 검색)
 */
export class LocalStorage {
  /**
   * localStorage에 저장된 값을 가져온다.
   */
  static get<T = any>(key: string) {
    if (typeof localStorage !== 'undefined') {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          return JSON.parse(value) as T;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // If parsing fails, return the original value as T
          // This handles cases where the stored value is not a valid JSON string
          return value as unknown as T;
        }
      }
    }
    return null;
  }

  /**
   * localStorage에 값을 저장한다.
   */
  static set<T = any>(key: string, value: T) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * localStorage에 저장된 값을 삭제한다.
   */
  static remove(key: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}
