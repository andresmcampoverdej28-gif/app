// lib/store/galleryStore.ts
import { type GalleryPhoto } from '@/components/molecules';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store de Galería usando solo AsyncStorage (sin Zustand)
 */

const STORAGE_KEY = '@snap_swipe_gallery';

// ✅ Event listeners para notificar cambios
type Listener = () => void;
const listeners = new Set<Listener>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Cargar todas las fotos desde AsyncStorage
 */
export const loadPhotos = async (): Promise<GalleryPhoto[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const photos: GalleryPhoto[] = stored ? JSON.parse(stored) : [];
    photos.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    console.log(`📸 ${photos.length} fotos cargadas`);
    return photos;
  } catch (error) {
    console.error('Error cargando fotos:', error);
    throw new Error('No se pudieron cargar las fotos');
  }
};

/**
 * Agregar una nueva foto
 */
export const addPhoto = async (uri: string): Promise<GalleryPhoto> => {
  try {
    const newPhoto: GalleryPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uri,
      timestamp: Date.now(),
    };

    const existingPhotos = await loadPhotos();
    const updatedPhotos = [newPhoto, ...existingPhotos];
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
    
    console.log('✅ Foto guardada:', newPhoto.id);
    
    // ✅ Notificar a todos los listeners
    notifyListeners();
    
    return newPhoto;
  } catch (error) {
    console.error('Error guardando foto:', error);
    throw new Error('No se pudo guardar la foto');
  }
};

/**
 * Eliminar una foto por ID
 */
export const deletePhoto = async (id: string): Promise<GalleryPhoto[]> => {
  try {
    const existingPhotos = await loadPhotos();
    const updatedPhotos = existingPhotos.filter(photo => photo.id !== id);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
    
    console.log('🗑️ Foto eliminada:', id);
    
    // ✅ Notificar a todos los listeners
    notifyListeners();
    
    return updatedPhotos;
  } catch (error) {
    console.error('Error eliminando foto:', error);
    throw new Error('No se pudo eliminar la foto');
  }
};

/**
 * Obtener una foto por ID
 */
export const getPhotoById = async (id: string): Promise<GalleryPhoto | null> => {
  try {
    const photos = await loadPhotos();
    return photos.find(photo => photo.id === id) || null;
  } catch (error) {
    console.error('Error obteniendo foto:', error);
    return null;
  }
};

/**
 * Limpiar todas las fotos
 */
export const clearAllPhotos = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('🧹 Todas las fotos eliminadas');
    
    // ✅ Notificar a todos los listeners
    notifyListeners();
  } catch (error) {
    console.error('Error limpiando fotos:', error);
    throw new Error('No se pudieron eliminar las fotos');
  }
};

/**
 * Obtener el conteo de fotos sin cargar todas
 */
export const getPhotosCount = async (): Promise<number> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const photos: GalleryPhoto[] = stored ? JSON.parse(stored) : [];
    return photos.length;
  } catch (error) {
    console.error('Error obteniendo conteo:', error);
    return 0;
  }
};

/**
 * Hook personalizado para usar en componentes
 * ✅ AHORA SE ACTUALIZA AUTOMÁTICAMENTE
 */
import { useState, useEffect, useCallback } from 'react';

export const useGalleryPhotos = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar fotos
  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedPhotos = await loadPhotos();
      setPhotos(loadedPhotos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Escuchar cambios automáticamente
  useEffect(() => {
    load(); // Carga inicial
    
    // Suscribirse a cambios
    const unsubscribe = subscribe(() => {
      console.log('🔄 Actualizando fotos...');
      load();
    });
    
    return unsubscribe;
  }, [load]);

  // Agregar foto
  const add = useCallback(async (uri: string) => {
    try {
      setError(null);
      const newPhoto = await addPhoto(uri);
      // No necesitamos setPhotos aquí porque el listener lo hará
      return newPhoto;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar foto');
      throw err;
    }
  }, []);

  // Eliminar foto
  const remove = useCallback(async (id: string) => {
    try {
      setError(null);
      await deletePhoto(id);
      // No necesitamos setPhotos aquí porque el listener lo hará
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar foto');
      throw err;
    }
  }, []);

  // Limpiar todas
  const clearAll = useCallback(async () => {
    try {
      setError(null);
      await clearAllPhotos();
      // No necesitamos setPhotos aquí porque el listener lo hará
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al limpiar fotos');
      throw err;
    }
  }, []);

  // Recargar fotos manualmente
  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  return {
    photos,
    isLoading,
    error,
    load,
    add,
    remove,
    clearAll,
    refresh,
  };
};