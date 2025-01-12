interface ErrorMessageProps {
    message: string;
  }

  export const ErrorMessage = ({ message }: ErrorMessageProps) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center text-red-600">
        <p className="text-xl mb-2">Error</p>
        <p>{message}</p>
      </div>
    </div>
  );
