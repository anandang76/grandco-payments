import Swal from 'sweetalert2';

let activeToast: any; // Keep a reference to the active toast

const CustomToast = (msg = '', type = 'success') => {
  const toast: any = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,  // Automatically close after 3 seconds
    customClass: { container: 'toast' },
  });

  // Store the active toast instance so it can be closed manually
  activeToast = toast.fire({
    icon: type,
    title: msg,
    padding: '10px 20px',
  });
};

const closeCustomToast = () => {
  // Close the active toast, if available
  if (Swal.isVisible()) {
    Swal.close();
  }
};

export { CustomToast, closeCustomToast };
