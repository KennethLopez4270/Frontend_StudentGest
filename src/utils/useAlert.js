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

export async function showConfirm(title = '¿Estás seguro?', text = "No podrás revertir esto", confirmButtonText = 'Sí, eliminar', cancelButtonText = 'Cancelar') {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText,
    cancelButtonText
  })
  return result.isConfirmed
}