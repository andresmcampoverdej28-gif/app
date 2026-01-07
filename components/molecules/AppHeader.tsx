import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from '../atoms';

interface AppHeaderProps {
  title?: string;
  showCameraButton?: boolean;
  onCameraPress?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onLeftIconPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'TinderClone',
  showCameraButton = true,
  onCameraPress,
  leftIcon,
  onLeftIconPress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        {leftIcon && onLeftIconPress ? (
          <IconButton
            icon={leftIcon}
            onPress={onLeftIconPress}
            size={40}
            color="#ff00ff"
          />
        ) : (
          <Ionicons name="flame" size={28} color="#ff00ff" />
        )}
        <Text style={styles.logo}>{title}</Text>
      </View>

      {showCameraButton && onCameraPress && (
        <IconButton
          icon="camera"
          onPress={onCameraPress}
          size={40}
          color="#00ffff"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2d0054',
    borderBottomWidth: 3,
    borderBottomColor: '#ff00ff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ffff',
  },
});

export default AppHeader;