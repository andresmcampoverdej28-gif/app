// components/organisms/CardsStack.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileCard } from '../molecules';
import type { Profile } from '../molecules';

interface CardsStackProps {
  profiles: Profile[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right') => void;
  maxVisible?: number;
}

const CardsStack: React.FC<CardsStackProps> = ({
  profiles,
  currentIndex,
  onSwipe,
  maxVisible = 2,
}) => {
  const visibleProfiles = profiles.slice(currentIndex, currentIndex + maxVisible);

  if (visibleProfiles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {visibleProfiles
        .reverse()
        .map((profile, index, array) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onSwipe={onSwipe}
            isTop={index === array.length - 1}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CardsStack;