import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';

interface VideoBackgroundProps {
  videoSource: any;
  currentSlide: number;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoSource 
}) => {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    // Pre-load and start video immediately
    const setupVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.loadAsync(videoSource, {
            shouldPlay: true,
            isLooping: true,
            isMuted: true,
          });
          await videoRef.current.playAsync();
        } catch (error) {
          console.log('Video setup error:', error);
        }
      }
    };
    setupVideo();
  }, [videoSource]);

  return (
    <>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={videoSource}
          style={styles.video}
          shouldPlay={true}
          isLooping={true}
          isMuted={true}
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          progressUpdateIntervalMillis={1000}
          positionMillis={0}
          onPlaybackStatusUpdate={(status) => {
            // Maintain smooth playback without interruptions
            if (status.isLoaded && !status.isPlaying && !status.didJustFinish && !status.isBuffering) {
              videoRef.current?.playAsync();
            }
          }}
        />
      </View>
      
      {/* Gradient Overlay for Better Text Readability */}
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0.2)',
          'rgba(0, 0, 0, 0.4)',
          'rgba(0, 0, 0, 0.7)',
          'rgba(0, 0, 0, 0.8)',
        ]}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradientOverlay}
      />
    </>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});