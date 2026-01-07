// app/index.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
// ✅ IMPORT DIRECTO para evitar conflictos
import SwipeContainerComponent from '@/components/organisms/SwipeContainer';
import { AppHeader, type Profile } from '@/components/molecules';
import { useSwipeLogic } from '@/lib/ui/useSwipeLogic';
import { useGalleryPhotos } from '@/lib/store/galleryStore';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const { photos, isLoading } = useGalleryPhotos();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Convertir fotos a perfiles
  useEffect(() => {
    if (photos.length > 0) {
      const profilesFromPhotos: Profile[] = photos.map((photo, index) => ({
        id: photo.timestamp || index,
        name: `Foto ${index + 1}`,
        age: 0, // No usamos edad para fotos
        image: photo.uri,
        bio: `Tomada el ${new Date(photo.timestamp || Date.now()).toLocaleDateString()}`,
      }));
      setProfiles(profilesFromPhotos);
    }
  }, [photos]);

  const {
    currentIndex,
    matches,
    swipe,
    like,
    pass,
    superLike,
    reset,
  } = useSwipeLogic(profiles);

  // Si no hay fotos, mostrar mensaje y botón para ir a cámara
  if (!isLoading && photos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader 
          title="Descubrir" 
          showCameraButton={true}
          onCameraPress={() => router.push('/camera')}
        />
        <SwipeContainerComponent
          profiles={[]}
          currentIndex={0}
          onSwipe={swipe}
          onPass={pass}
          onLike={like}
          onSuperLike={superLike}
          emptyStateTitle="¡No hay fotos todavía!"
          emptyStateSubtitle="Toma tu primera foto para comenzar a deslizar"
          emptyStateButtonText="Ir a Cámara"
          onEmptyStateButtonPress={() => router.push('/camera')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        title="Descubrir" 
        showCameraButton={true}
        onCameraPress={() => router.push('/camera')}
      />
      
      <SwipeContainerComponent
        profiles={profiles}
        currentIndex={currentIndex}
        onSwipe={swipe}
        onPass={pass}
        onLike={like}
        onSuperLike={() => {
          superLike();
          Alert.alert('¡Super Like!', '⭐ Has dado super like a esta foto');
        }}
        emptyStateTitle="¡Has visto todas las fotos!"
        emptyStateSubtitle={`Matches: ${matches.length} fotos`}
        emptyStateButtonText="Reiniciar"
        onEmptyStateButtonPress={reset}
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