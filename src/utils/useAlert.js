// src/utils/useAlert.js
import Swal from 'sweetalert2'

export function showSuccess(title = 'Éxito', text = '') {
  Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#213547',
    timer: 2000,
    showConfirmButton: false
  })
}

export function showError(title = 'Error', text = '') {
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#213547'
  })
}