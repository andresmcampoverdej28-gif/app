// app/gallery.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
// ✅ IMPORT DIRECTO para evitar conflictos
import GalleryGridComponent from '@/components/organisms/GalleryGrid';
import { AppHeader, type GalleryPhoto } from '@/components/molecules';
import { useGalleryPhotos } from '@/lib/store/galleryStore';
import { useRouter } from 'expo-router';

export default function Gallery() {
  const router = useRouter();
  const { photos, isLoading, remove, refresh } = useGalleryPhotos();

  const handlePhotoPress = (photo: GalleryPhoto) => {
    Alert.alert(
      'Ver Foto',
      `Foto tomada el ${new Date(photo.timestamp || 0).toLocaleString()}`,
      [
        { text: 'Cerrar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handlePhotoDelete(photo),
        },
      ]
    );
  };

  const handlePhotoDelete = async (photo: GalleryPhoto) => {
    Alert.alert(
      'Eliminar foto',
      '¿Estás seguro de que quieres eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(photo.id);
              Alert.alert('✅ Foto eliminada');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la foto');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        title="Galería" 
        showCameraButton={true}
        onCameraPress={() => router.push('/camera')}
      />
      
      <GalleryGridComponent
        photos={photos}
        onPhotoPress={handlePhotoPress}
        onPhotoDelete={handlePhotoDelete}
        showDeleteButton={true}
        emptyStateTitle="No hay fotos"
        emptyStateSubtitle="Toma tu primera foto con la cámara"
        emptyStateButtonText="Ir a Cámara"
        onEmptyStateButtonPress={() => router.push('/camera')}
        refreshing={isLoading}
        onRefresh={refresh}
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