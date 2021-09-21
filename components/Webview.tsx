import React from 'react';
import { WebView } from 'react-native-webview';
import { Platform, View } from 'react-native';

export type WebviewProps = {
  uri?: string;
  style?: any;
  height?: number;
};

const Webview = (props: WebviewProps): JSX.Element => {
  const { uri, style, height } = props;

  return (
    <View>
      {Platform.OS === 'web' ? (
        <iframe src={uri} style={{ border: 'none', ...style }} height={height} />
      ) : (
        <WebView style={{ flex: 1, ...style }} source={{ uri: uri }} />
      )}
    </View>
  );
};

export default Webview;
