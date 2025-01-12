export class APIError extends Error {
    constructor(
      message: string,
      public statusCode?: number,
      public responseData?: unknown
    ) {
      super(message);
      this.name = 'APIError';
    }
  }

  export class TransformationError extends Error {
    constructor(
      message: string,
      public sourceData?: unknown
    ) {
      super(message);
      this.name = 'TransformationError';
    }
  }

  export class ValidationError extends Error {
    constructor(
      message: string,
      public invalidFields?: string[]
    ) {
      super(message);
      this.name = 'ValidationError';
    }
  }
