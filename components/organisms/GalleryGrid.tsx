import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { EmptyState, GalleryItem, type GalleryPhoto } from '../molecules';

interface GalleryGridProps {
  photos: GalleryPhoto[];
  onPhotoPress?: (photo: GalleryPhoto) => void;
  onPhotoDelete?: (photo: GalleryPhoto) => void;
  showDeleteButton?: boolean;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateButtonText?: string;
  onEmptyStateButtonPress?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  photos,
  onPhotoPress,
  onPhotoDelete,
  showDeleteButton = false,
  emptyStateTitle = 'No hay fotos',
  emptyStateSubtitle = 'Toma tu primera foto con la cámara',
  emptyStateButtonText,
  onEmptyStateButtonPress,
  refreshing = false,
  onRefresh,
}) => {
  const renderItem = ({ item }: { item: GalleryPhoto }) => (
    <GalleryItem
      photo={item}
      onPress={() => onPhotoPress?.(item)}
      onDelete={() => onPhotoDelete?.(item)}
      showDeleteButton={showDeleteButton}
    />
  );

  const renderEmpty = () => (
    <EmptyState
      icon="images-outline"
      title={emptyStateTitle}
      subtitle={emptyStateSubtitle}
      buttonText={emptyStateButtonText}
      onButtonPress={onEmptyStateButtonPress}
    />
  );

  if (photos.length === 0) {
    return renderEmpty();
  }

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default GalleryGrid;