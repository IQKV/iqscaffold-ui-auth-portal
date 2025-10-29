import { UseFormReturnType } from "@mantine/form";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getErrorMessage,
  getErrorTitle,
  normalizeAxiosError,
  shouldShowError,
  toMantineErrors,
} from "./http-error";
import { notificationService } from "./notifications";

export type NotifyConfig = {
  title?: string;
  message?: string;
  fallback?: string;
};

export type FormMutationOptions<TData, TVariables, TContext> =
  UseMutationOptions<TData, unknown, TVariables, TContext> & {
    notifySuccess?: NotifyConfig | false;
    notifyError?:
      | (NotifyConfig & { includeFieldErrorsInMessage?: boolean })
      | false;
    mapField?: (errors: Record<string, string>) => Record<string, string>;
  };

export function useFormMutation<TData, TVariables, TContext = unknown>(
  form: UseFormReturnType<any>,
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: FormMutationOptions<TData, TVariables, TContext>
): UseMutationResult<TData, unknown, TVariables, TContext> {
  const {
    notifySuccess,
    notifyError = { title: "Request failed", fallback: "Something went wrong" },
    mapField,
    onError,
    onSuccess,
    ...rest
  } = options ?? ({} as any);

  return useMutation<TData, unknown, TVariables, TContext>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Clear previous field errors
      form.setErrors({});

      if (
        notifySuccess &&
        (notifySuccess.message || typeof notifySuccess === "object")
      ) {
        notificationService.success({
          title: notifySuccess.title ?? "Success",
          message:
            (notifySuccess.message as string) ??
            "Operation completed successfully",
        });
      }

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const normalized = normalizeAxiosError(error);

      // Map field-level errors to form
      const fieldErrors = toMantineErrors(normalized);
      const mapped = mapField ? mapField(fieldErrors) : fieldErrors;
      if (Object.keys(mapped).length) {
        form.setErrors(mapped);
      }

      if (notifyError !== false && shouldShowError(error)) {
        // Use enhanced error notification for better RFC 7807 support
        notificationService.errorFromAxios(error, {
          title: notifyError.title || getErrorTitle(error),
        });
      }

      onError?.(normalized as any, variables, context);
    },
    ...rest,
  });
}
