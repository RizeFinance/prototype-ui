import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';

export type WebviewProps = {
  uri?: string;
  style?: React.CSSProperties;
  height?: number;
  onLoad?: () => void;
  width?: number;
};

const Webview = (props: WebviewProps): JSX.Element => {
  const { uri, style, height, width, onLoad } = props;
  const [isLoading, setIsLoading] = useState(true);

  const ref = useRef<HTMLIFrameElement>();

  const styles = StyleSheet.create({
    visible: {
      display: 'flex',
    },
    hidden: {
      display: 'none',
    },
    view: {
      alignItems: 'center',
      height,
      width,
      justifyContent: 'center',
      alignSelf: 'center',
    },
  });

  const handleOnLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const iFrame = ref.current;
    iFrame && iFrame.addEventListener('load', () => handleOnLoad());
    return () => removeEventListener('load', () => handleOnLoad());
  }, [onLoad]);

  return (
    <View style={styles.view}>
      {isLoading && <ActivityIndicator size="large" />}

      {Platform.OS === 'web' ? (
        <View style={[isLoading ? styles.hidden : styles.visible]}>
          <iframe
            ref={ref}
            src={uri}
            width={width}
            height={height}
            style={{ border: 'none', ...style }}
          />
        </View>
      ) : (
        <WebView style={[{ flex: 1 }, style && { ...style }]} source={{ uri: uri }} />
      )}
    </View>
  );
};

export default Webview;
