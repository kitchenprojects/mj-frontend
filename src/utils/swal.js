// Reusable UI utilities using SweetAlert2
import Swal from 'sweetalert2';

// Toast notifications (auto-close)
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// Show success toast
export const showSuccess = (message) => {
  Toast.fire({
    icon: 'success',
    title: message
  });
};

// Show error toast
export const showError = (message) => {
  Toast.fire({
    icon: 'error',
    title: message
  });
};

// Show warning toast
export const showWarning = (message) => {
  Toast.fire({
    icon: 'warning',
    title: message
  });
};

// Show info toast
export const showInfo = (message) => {
  Toast.fire({
    icon: 'info',
    title: message
  });
};

// Confirmation dialog
export const confirmAction = async (title, text, confirmButtonText = 'Ya', cancelButtonText = 'Batal') => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true
  });
  return result.isConfirmed;
};

// Delete confirmation (with danger color)
export const confirmDelete = async (itemName = 'item ini') => {
  const result = await Swal.fire({
    title: 'Hapus?',
    text: `Yakin ingin menghapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
    reverseButtons: true
  });
  return result.isConfirmed;
};

// Loading dialog
export const showLoading = (title = 'Loading...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close loading
export const hideLoading = () => {
  Swal.close();
};

// Input dialog
export const promptInput = async (title, inputPlaceholder = '') => {
  const result = await Swal.fire({
    title,
    input: 'text',
    inputPlaceholder,
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'OK',
    cancelButtonText: 'Batal',
    inputValidator: (value) => {
      if (!value) {
        return 'Field tidak boleh kosong!';
      }
    }
  });
  return result.value;
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  confirmAction,
  confirmDelete,
  showLoading,
  hideLoading,
  promptInput
};
