import { toast } from 'react-toastify';

export const toastMessage = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export const showErrorToast = (message) => {
  toast.error(message, toastMessage);
};

export const showSuccessToast = (message) => {
  toast.success(message, toastMessage);
};
