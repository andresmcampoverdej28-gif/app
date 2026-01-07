import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CameraControlsProps {
  onCapture: () => void;
  onFlipCamera?: () => void;
  onClose?: () => void;
  disabled?: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onFlipCamera,
  onClose,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Botón Flip/Toggle Camera */}
      {onFlipCamera && (
        <TouchableOpacity
          style={styles.sideButton}
          onPress={onFlipCamera}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Ionicons name="camera-reverse" size={32} color="#00ffff" />
        </TouchableOpacity>
      )}

      {/* Botón Captura Central */}
      <TouchableOpacity
        style={[styles.captureButton, disabled && styles.captureButtonDisabled]}
        onPress={onCapture}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={styles.captureButtonInner} />
      </TouchableOpacity>

      {/* Botón Cerrar */}
      {onClose && (
        <TouchableOpacity
          style={styles.sideButton}
          onPress={onClose}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={32} color="#ff0090" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#2d0054',
    borderTopWidth: 3,
    borderTopColor: '#ff00ff',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00ffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ff00ff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2d0054',
    borderWidth: 3,
    borderColor: '#ff00ff',
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2d0054',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff00ff',
  },
});

export default CameraControls;