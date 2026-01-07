// components/organisms/CameraView.tsx
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CameraView as ExpoCamera, CameraType, useCameraPermissions } from 'expo-camera';
import { CameraControls } from '../molecules';

interface CameraViewProps {
  onPhotoTaken?: (uri: string) => void;
  onClose?: () => void;
  defaultCameraType?: CameraType;
}

const CameraView: React.FC<CameraViewProps> = ({
  onPhotoTaken,
  onClose,
  defaultCameraType = 'back',
}) => {
  const [facing, setFacing] = useState<CameraType>(defaultCameraType);
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<ExpoCamera>(null);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (photo && onPhotoTaken) {
        onPhotoTaken(photo.uri);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Estado de carga de permisos
  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando cámara...</Text>
        </View>
      </View>
    );
  }

  // Sin permisos
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Se necesita acceso a la cámara</Text>
          <Text style={styles.permissionText}>
            Para tomar fotos, necesitamos permiso para acceder a tu cámara.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Dar Permiso</Text>
          </TouchableOpacity>
          {onClose && (
            <TouchableOpacity style={styles.closeTextButton} onPress={onClose}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Cámara lista
  return (
    <View style={styles.container}>
      <ExpoCamera style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraOverlay} />
      </ExpoCamera>

      <CameraControls
        onCapture={takePicture}
        onFlipCamera={toggleCameraFacing}
        onClose={onClose}
        disabled={isProcessing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00ffff',
    fontSize: 18,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  permissionText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#ff0090',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#ff00ff',
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeTextButton: {
    marginTop: 20,
  },
  closeText: {
    color: '#00ffff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default CameraView;