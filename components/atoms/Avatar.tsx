// components/atoms/Avatar.tsx
import React from 'react';
import { Image, View, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarProps {
  uri?: string;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 60,
  borderColor = '#00ffff',
  borderWidth = 2,
  showOnlineIndicator = false,
  isOnline = false,
}) => {
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: borderWidth,
    borderColor: borderColor,
    overflow: 'hidden',
    backgroundColor: '#2d0054',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
  };

  const onlineIndicatorStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: size * 0.25,
    height: size * 0.25,
    borderRadius: (size * 0.25) / 2,
    backgroundColor: isOnline ? '#00ff88' : '#666',
    borderWidth: 2,
    borderColor: '#2d0054',
  };

  return (
    <View style={containerStyle}>
      {uri ? (
        <Image source={{ uri }} style={imageStyle} resizeMode="cover" />
      ) : (
        <Ionicons name="person" size={size * 0.6} color="#00ffff" />
      )}
      {showOnlineIndicator && <View style={onlineIndicatorStyle} />}
    </View>
  );
};

export default Avatar;