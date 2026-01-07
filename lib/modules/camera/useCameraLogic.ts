import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';

export interface CameraState {
  // Referencia a la cámara nativa
  cameraRef: React.RefObject<CameraView|null>;
  
  // Tipo actual de cámara (frontal o trasera)
  facing: CameraType;
  
  // Permisos de la cámara
  permission: any;
  
  // Si se está procesando una foto
  isProcessing: boolean;
  
  // Último error que ocurrió
  error: string | null;
}

export interface CameraActions {
  // Solicitar permisos de cámara
  requestPermission: () => Promise<void>;
  
  // Cambiar entre cámara frontal y trasera
  toggleCameraFacing: () => void;
  
  // Tomar una foto
  takePicture: () => Promise<string | null>;
  
  // Limpiar errores
  clearError: () => void;
}

export const useCameraLogic = (
  defaultFacing: CameraType = 'back'
): CameraState & CameraActions => {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>(defaultFacing);
  const [permission, requestPermissionInternal] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Solicitar permisos de cámara al usuario
   */
  const requestPermission = async () => {
    try {
      await requestPermissionInternal();
    } catch (err) {
      setError('Error al solicitar permisos de cámara');
      console.error(err);
    }
  };

  /**
   * Alternar entre cámara frontal y trasera
   */
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  /**
   * Capturar una foto
   * @returns URI de la foto capturada o null si hay error
   */
  const takePicture = async (): Promise<string | null> => {
    if (!cameraRef.current || isProcessing) {
      return null;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (!photo) {
        throw new Error('No se pudo capturar la foto');
      }

      return photo.uri;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al tomar la foto';
      setError(errorMessage);
      console.error('Error al capturar foto:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Limpiar mensajes de error
   */
  const clearError = () => {
    setError(null);
  };

  return {
    // Estado
    cameraRef,
    facing,
    permission,
    isProcessing,
    error,

    // Acciones
    requestPermission,
    toggleCameraFacing,
    takePicture,
    clearError,
  };
};