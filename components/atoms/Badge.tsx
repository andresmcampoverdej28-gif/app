import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  count: number;
  maxCount?: number;
  size?: number;
  color?: string;
  borderColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  count,
  maxCount = 99,
  size = 20,
  color = '#ff0090',
  borderColor = '#ff00ff',
}) => {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <View
      style={[
        styles.badge,
        {
          minWidth: size,
          height: size,
          backgroundColor: color,
          borderColor: borderColor,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: size * 0.6 }]}>
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Badge;