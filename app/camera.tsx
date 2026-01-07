// app/camera.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
// ✅ IMPORT DIRECTO del archivo (no desde index)
import CameraViewComponent from '@/components/organisms/CameraView';
import { useGalleryPhotos } from '@/lib/store/galleryStore';
import { useRouter } from 'expo-router';

export default function Camera() {
  const router = useRouter();
  const { add } = useGalleryPhotos();

  const handlePhotoTaken = async (uri: string) => {
    console.log('📸 Foto capturada:', uri); // Debug
    try {
      await add(uri);
      
      Alert.alert(
        '¡Foto guardada! 📸',
        '¿Qué quieres hacer ahora?',
        [
          { 
            text: 'Ver Galería', 
            onPress: () => router.push('/gallery') 
          },
          { 
            text: 'Tomar Otra', 
            style: 'cancel' 
          },
          { 
            text: 'Ver en Index', 
            onPress: () => router.push('/') 
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la foto');
      console.error('Error guardando foto:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraViewComponent
        onPhotoTaken={handlePhotoTaken}
        defaultCameraType="back"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
});