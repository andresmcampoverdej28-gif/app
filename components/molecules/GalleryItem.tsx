import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 45) / 3; // 3 columnas con espaciado

export interface GalleryPhoto {
  id: string;
  uri: string;
  timestamp?: number;
}

interface GalleryItemProps {
  photo: GalleryPhoto;
  onPress?: () => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  photo,
  onPress,
  onDelete,
  showDeleteButton = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: photo.uri }} style={styles.image} />
      
      {showDeleteButton && onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={24} color="#ff0090" />
        </TouchableOpacity>
      )}

      <View style={styles.overlay} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ff00ff',
    backgroundColor: '#2d0054',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(45, 0, 84, 0.9)',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: '#ff00ff',
  },
});

export default GalleryItem;