// index.tsx - Componente Principal
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

// Tipo para los perfiles
interface Profile {
  id: number;
  name: string;
  age: number;
  image: string;
  bio: string;
}

// Datos de ejemplo de perfiles
const PROFILES: Profile[] = [
  {
    id: 1,
    name: 'María',
    age: 25,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Amante de la aventura y el café ☕',
  },
  {
    id: 2,
    name: 'Sofia',
    age: 23,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    bio: 'Viajera y fotógrafa 📸',
  },
  {
    id: 3,
    name: 'Ana',
    age: 27,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    bio: 'Yoga y meditación 🧘‍♀️',
  },
  {
    id: 4,
    name: 'Laura',
    age: 26,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    bio: 'Artista y soñadora 🎨',
  },
  {
    id: 5,
    name: 'Carmen',
    age: 24,
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
    bio: 'Amante de la música 🎵',
  },
];

// Props para el componente Card
interface CardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

// Componente de Card Individual
const Card: React.FC<CardProps> = ({ profile, onSwipe, isTop }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction: 'left' | 'right' = translateX.value > 0 ? 'right' : 'left';
        translateX.value = withTiming(
          translateX.value > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
          {},
          () => {
            runOnJS(onSwipe)(direction);
          }
        );
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    })
    .enabled(isTop);

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-30, 0, 30]
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity: isTop ? opacity : 1,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Image source={{ uri: profile.image }} style={styles.cardImage} />

        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.cardBio}>{profile.bio}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

// Componente Principal
const Index: React.FC = () => {
  const [profiles] = useState<Profile[]>(PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setMatches([...matches, profiles[currentIndex]]);
    }
    setCurrentIndex(currentIndex + 1);
  };

  const handleLike = () => {
    handleSwipe('right');
  };

  const handlePass = () => {
    handleSwipe('left');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Foto tomada:', photo?.uri);
        setShowCamera(false);
      } catch (error) {
        console.error('Error al tomar la foto:', error);
      }
    }
  };

  const toggleCamera = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (result.granted) {
        setShowCamera(true);
      }
    } else {
      setShowCamera(true);
    }
  };

  if (currentIndex >= profiles.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>¡No hay más perfiles!</Text>
          <Text style={styles.matchesText}>Matches: {matches.length}</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.resetButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="flame" size={28} color="#ff00ff" />
            <Text style={styles.logo}>TinderClone</Text>
          </View>
          <TouchableOpacity onPress={openCamera}>
            <Ionicons name="camera" size={28} color="#00ffff" />
          </TouchableOpacity>
        </View>

        {/* Cards Stack */}
        <View style={styles.cardsContainer}>
          {profiles
            .slice(currentIndex, currentIndex + 2)
            .reverse()
            .map((profile, index, array) => (
              <Card
                key={profile.id}
                profile={profile}
                onSwipe={handleSwipe}
                isTop={index === array.length - 1}
              />
            ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={handlePass}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]}>
            <Ionicons name="star" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={handleLike}
          >
            <Ionicons name="heart" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Modal de Cámara */}
        <Modal visible={showCamera} animationType="slide">
          <View style={styles.cameraContainer}>
            {!permission?.granted ? (
              <View style={styles.permissionContainer}>
                <Text style={styles.noPermissionText}>
                  Se necesita permiso para acceder a la cámara
                </Text>
                <TouchableOpacity
                  style={styles.permissionButton}
                  onPress={requestPermission}
                >
                  <Text style={styles.permissionButtonText}>Dar Permiso</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                  <View style={styles.cameraControls}>
                    <TouchableOpacity
                      style={styles.toggleCameraButton}
                      onPress={toggleCamera}
                    >
                      <Ionicons name="camera-reverse" size={32} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </CameraView>
                <View style={styles.cameraActions}>
                  <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <Ionicons name="camera" size={40} color="#2d0054" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowCamera(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
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
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.65,
    borderRadius: 20,
    backgroundColor: '#2d0054',
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#00ffff',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(45, 0, 84, 0.95)',
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    borderTopWidth: 3,
    borderTopColor: '#ff00ff',
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 5,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  cardBio: {
    fontSize: 16,
    color: '#ffffff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#2d0054',
    borderTopWidth: 3,
    borderTopColor: '#ff00ff',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
  },
  passButton: {
    backgroundColor: '#ff0090',
    borderColor: '#ff00ff',
  },
  likeButton: {
    backgroundColor: '#00ff88',
    borderColor: '#00ffff',
  },
  superLikeButton: {
    backgroundColor: '#9900ff',
    borderColor: '#ff00ff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a0033',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00ffff',
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  matchesText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#ff0090',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#ff00ff',
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  toggleCameraButton: {
    backgroundColor: '#9900ff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ff00ff',
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  cameraActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#2d0054',
    borderTopWidth: 3,
    borderTopColor: '#ff00ff',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00ffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ff00ff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ff0090',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ff00ff',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a0033',
  },
  noPermissionText: {
    color: '#00ffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#ff0090',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#ff00ff',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Index;