export type RunningEnv = 'local' | 'dev' | 'prod';

const getRunningEnv = (): RunningEnv => {
  if (process.env.NODE_ENV === 'development') {
    return 'local';
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL?.includes('dev')) {
    return 'dev';
  }
  return 'prod';
};

export const appConfig = {
  runningEnv: getRunningEnv(),
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
};
