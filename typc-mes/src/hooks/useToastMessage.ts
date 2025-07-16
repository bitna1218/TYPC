import { TOASTIFY_CONTAINER_ID } from '@/providers/ToastifyContainer';
import { appConfig } from '@/config';
import { AxiosError, isAxiosError } from 'axios';
import { useCallback, useMemo } from 'react';
import {
  ToastContent,
  ToastOptions,
  toast as toastOrigin,
} from 'react-toastify';

/**
 * NOTE: 로그인이 되지 않은 페이지에서도 사용되기 때문에 session data 같은 것이 필요할 경우 각 메서드를 통해 외부에서 전달 받아야 한다
 */
export default function useToastMessage() {
  const toastInfo = useCallback(
    (content: ToastContent, options?: ToastOptions) => {
      return toastOrigin.info(content, {
        containerId: TOASTIFY_CONTAINER_ID,
        ...options,
      });
    },
    [],
  );
  const toastSuccess = useCallback(
    (content: ToastContent, options?: ToastOptions) => {
      return toastOrigin.success(content, {
        containerId: TOASTIFY_CONTAINER_ID,
        ...options,
      });
    },
    [],
  );
  const toastError = useCallback(
    (content: ToastContent, err?: AxiosError, options?: ToastOptions) => {
      const messageContent: ToastContent[] = [content];
      if (appConfig.runningEnv !== 'prod' && isAxiosError(err)) {
        const method = err.config?.method?.toUpperCase();
        const payload =
          method === 'GET' ? err.config?.params : err.config?.data;
        messageContent.push(`[${method}] ${err.config?.url}`);
        messageContent.push(JSON.stringify(payload));
      }
      const message = messageContent.join(
        '\n-----------------------------------\n',
      );
      return toastOrigin.error(message, {
        autoClose: appConfig.runningEnv === 'prod' ? 5000 : false,
        containerId: TOASTIFY_CONTAINER_ID,
        ...options,
      });
    },
    [],
  );
  const toastWarn = useCallback(
    (content: ToastContent, options?: ToastOptions) => {
      return toastOrigin.warn(content, {
        containerId: TOASTIFY_CONTAINER_ID,
        ...options,
      });
    },
    [],
  );

  const toastCustom = useMemo(
    () => ({
      info: toastInfo,
      success: toastSuccess,
      error: toastError,
      warn: toastWarn,
      dismiss: toastOrigin.dismiss,
    }),
    [toastInfo, toastSuccess, toastError, toastWarn],
  );

  return { toast: toastCustom };
}
