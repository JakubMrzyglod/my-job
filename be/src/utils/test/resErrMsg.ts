type ErrorMessageBody = {
  statusCode?: number;
  error?: string;
  message: string;
};
export const resErrMsg = (
  statusCode: number,
  message: string,
): [number, ErrorMessageBody] => [
  statusCode,
  {
    ...STATUS_CODE_PART[statusCode],
    message,
  },
];

const STATUS_CODE_PART = {
  [404]: { statusCode: 404, error: 'Not Found' },
  [409]: { statusCode: 409, error: 'Conflict' },
};
