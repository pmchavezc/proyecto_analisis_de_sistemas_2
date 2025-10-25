import toast from 'react-hot-toast';

/**
 * Utilidad centralizada para mostrar notificaciones toast
 * Proporciona una interfaz consistente para todos los mensajes de la app
 */

// Configuración de duraciones
const DURATIONS = {
  success: 4000,
  error: 5000,
  info: 3000,
  loading: Infinity,
} as const;

// ========== MENSAJES DE ÉXITO ==========

export const showSuccessToast = (message: string, duration?: number) => {
  toast.success(message, {
    duration: duration ?? DURATIONS.success,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  });
};

// Mensajes predefinidos de éxito
export const successMessages = {
  requestRegistered: () => showSuccessToast('✓ Solicitud registrada exitosamente'),
  requestProgrammed: () => showSuccessToast('✓ Solicitud programada correctamente'),
  requestCompleted: () => showSuccessToast('✓ Solicitud completada exitosamente'),
  financingRequested: () => showSuccessToast('✓ Solicitud de financiamiento enviada'),
  financingApproved: () => showSuccessToast('✓ Financiamiento aprobado'),
  externalRequestConfirmed: () => showSuccessToast('✓ Solicitud externa confirmada'),
  dataUpdated: () => showSuccessToast('✓ Datos actualizados correctamente'),
  dataSaved: () => showSuccessToast('✓ Datos guardados exitosamente'),
};

// ========== MENSAJES DE ERROR ==========

export const showErrorToast = (message: string, duration?: number) => {
  toast.error(message, {
    duration: duration ?? DURATIONS.error,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  });
};

// Mensajes predefinidos de error
export const errorMessages = {
  requestFailed: () => showErrorToast('✗ No se pudo registrar la solicitud'),
  programmingFailed: () => showErrorToast('✗ No se pudo programar la solicitud'),
  financingFailed: () => showErrorToast('✗ No se pudo solicitar el financiamiento'),
  loadDataFailed: () => showErrorToast('✗ Error al cargar los datos'),
  updateFailed: () => showErrorToast('✗ No se pudo actualizar la información'),
  connectionError: () => showErrorToast('✗ Error de conexión con el servidor'),
  unauthorizedError: () => showErrorToast('✗ No tienes autorización para esta acción'),
  notFoundError: () => showErrorToast('✗ Recurso no encontrado'),
  validationError: (field?: string) => 
    showErrorToast(field ? `✗ Error de validación: ${field}` : '✗ Por favor verifica los datos ingresados'),
  genericError: () => showErrorToast('✗ Ocurrió un error inesperado'),
};

// ========== MENSAJES INFORMATIVOS ==========

export const showInfoToast = (message: string, duration?: number) => {
  toast(message, {
    duration: duration ?? DURATIONS.info,
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: '#fff',
      fontWeight: '500',
    },
    icon: 'ℹ️',
  });
};

// ========== MENSAJES DE ADVERTENCIA ==========

export const showWarningToast = (message: string, duration?: number) => {
  toast(message, {
    duration: duration ?? DURATIONS.info,
    position: 'top-right',
    style: {
      background: '#f59e0b',
      color: '#fff',
      fontWeight: '500',
    },
    icon: '⚠️',
  });
};

// ========== LOADING TOAST ==========

export const showLoadingToast = (message: string = 'Cargando...') => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6b7280',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

// Actualizar toast de loading a éxito o error
export const updateToast = {
  success: (toastId: string, message: string) => {
    toast.success(message, {
      id: toastId,
      duration: DURATIONS.success,
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },
  error: (toastId: string, message: string) => {
    toast.error(message, {
      id: toastId,
      duration: DURATIONS.error,
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },
};

// ========== PROMESAS ==========

/**
 * Muestra un toast durante una promesa
 * Automáticamente muestra loading, success o error según el resultado
 */
export const toastPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
): Promise<T> => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      style: {
        minWidth: '250px',
        fontWeight: '500',
      },
      success: {
        duration: DURATIONS.success,
        style: {
          background: '#10b981',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      },
      error: {
        duration: DURATIONS.error,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      },
      loading: {
        style: {
          background: '#6b7280',
          color: '#fff',
        },
      },
    }
  );
};

// ========== UTILIDADES ==========

export const dismissToast = (toastId?: string) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

export const dismissAllToasts = () => {
  toast.dismiss();
};
