// Тип для ошибок валидации DRF, основанный на полях payload + общие ошибки
export type BaseValidationErrors<T = Record<string, unknown>> = {
  [K in keyof T]?: string[];
} & {
  non_field_errors?: string[];
  detail?: string;
};

export class ApiError<T = BaseValidationErrors> extends Error {
  public data: T;
  public status: number;
  public isServerError = true;

  constructor(status: number, data: T) {
    super("API Server Error");
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}