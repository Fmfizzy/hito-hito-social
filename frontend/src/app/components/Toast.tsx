import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyles = "fixed top-4 right-4 px-4 py-3 rounded shadow-lg z-50 transition-all duration-300";
  const variantStyles = type === 'success'
    ? "bg-green-100 border border-green-400 text-green-700"
    : "bg-red-100 border border-red-400 text-red-700";

  return (
    <div className={`${baseStyles} ${variantStyles}`}>
      <span className="block">{message}</span>
    </div>
  );
};

export default Toast;
