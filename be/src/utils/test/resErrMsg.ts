type ErrorMessageBody<T> = {
  statusCode?: number;
  error?: string;
  message: T;
};
export const resErrMsg = <T extends string | string[]>(
  statusCode: number,
  message: T,
): [number, ErrorMessageBody<T>] => [
  statusCode,
  {
    ...STATUS_CODE_PART[statusCode],
    message,
  },
];

const STATUS_CODE_PART = {
  [400]: { statusCode: 400, error: 'Bad Request' },
  [404]: { statusCode: 404, error: 'Not Found' },
  [409]: { statusCode: 409, error: 'Conflict' },
};
