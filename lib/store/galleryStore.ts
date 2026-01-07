// lib/store/galleryStore.ts
import { type GalleryPhoto } from '@/components/molecules';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store de Galería usando solo AsyncStorage (sin Zustand)
 * 
 * ¿QUÉ HACE?
 * - Proporciona funciones para interactuar con AsyncStorage
 * - Guarda y carga fotos de forma persistente
 * - No mantiene estado en memoria (cada componente maneja su propio estado)
 * 
 * ¿POR QUÉ EXISTE?
 * Necesitamos persistir fotos entre sesiones de la app.
 * Los componentes usarán useState + estas funciones.
 */

const STORAGE_KEY = '@snap_swipe_gallery';

/**
 * Cargar todas las fotos desde AsyncStorage
 * @returns Array de fotos ordenadas por más reciente
 */
export const loadPhotos = async (): Promise<GalleryPhoto[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const photos: GalleryPhoto[] = stored ? JSON.parse(stored) : [];
    
    // Ordenar por más reciente primero
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
 * @param uri - URI de la foto capturada
 * @returns La foto agregada
 */
export const addPhoto = async (uri: string): Promise<GalleryPhoto> => {
  try {
    // Crear nueva foto
    const newPhoto: GalleryPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uri,
      timestamp: Date.now(),
    };

    // Cargar fotos existentes
    const existingPhotos = await loadPhotos();
    
    // Agregar al inicio
    const updatedPhotos = [newPhoto, ...existingPhotos];
    
    // Guardar en AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
    
    console.log('✅ Foto guardada:', newPhoto.id);
    return newPhoto;
  } catch (error) {
    console.error('Error guardando foto:', error);
    throw new Error('No se pudo guardar la foto');
  }
};

/**
 * Eliminar una foto por ID
 * @param id - ID de la foto a eliminar
 * @returns Array actualizado de fotos
 */
export const deletePhoto = async (id: string): Promise<GalleryPhoto[]> => {
  try {
    // Cargar fotos existentes
    const existingPhotos = await loadPhotos();
    
    // Filtrar la foto eliminada
    const updatedPhotos = existingPhotos.filter(photo => photo.id !== id);
    
    // Guardar en AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
    
    console.log('🗑️ Foto eliminada:', id);
    return updatedPhotos;
  } catch (error) {
    console.error('Error eliminando foto:', error);
    throw new Error('No se pudo eliminar la foto');
  }
};

/**
 * Obtener una foto por ID
 * @param id - ID de la foto a buscar
 * @returns La foto encontrada o null
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
  } catch (error) {
    console.error('Error limpiando fotos:', error);
    throw new Error('No se pudieron eliminar las fotos');
  }
};

/**
 * Obtener el conteo de fotos sin cargar todas
 * @returns Número total de fotos
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
 * Simplifica el uso de las funciones con estado React
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

  // Agregar foto
  const add = useCallback(async (uri: string) => {
    try {
      setError(null);
      const newPhoto = await addPhoto(uri);
      setPhotos(prev => [newPhoto, ...prev]);
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
      const updatedPhotos = await deletePhoto(id);
      setPhotos(updatedPhotos);
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
      setPhotos([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al limpiar fotos');
      throw err;
    }
  }, []);

  // Recargar fotos
  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  // Cargar al montar
  useEffect(() => {
    load();
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