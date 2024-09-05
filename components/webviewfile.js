import React, {useState, useEffect, useRef} from 'react';
import {BackHandler, Linking, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import {ActivityIndicator} from 'react-native';
const LogInContainer = () => {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleBackPress = () => {
    if (canGoBack) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [canGoBack]);

  const handleNavigationChange = (navState) => {
    setCanGoBack(navState.canGoBack);

    // Check if the URL is part of Firebase or Google authentication process
    if (
      navState.url.includes('firebaseapp.com/__/auth/handler') ||
      navState.url.includes('accounts.google.com') ||
      navState.url.includes('oauth2')
    ) {
      // Allow these URLs to proceed in WebView
      return true;
    }

    return false;
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://fantasy-prime-minister-web.onrender.com/' }}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      mixedContentMode="always"
      onNavigationStateChange={handleNavigationChange}
      onShouldStartLoadWithRequest={(request) => {
        const { url } = request;
        if (
          url.includes('fantasy-prime-minister-web.onrender.com') ||
          url.includes('firebaseapp.com') ||
          url.includes('accounts.google.com')
        ) {
          return true;
        }
        Linking.openURL(url).catch((err) =>
          Alert.alert('Failed to open page', err.message)
        );

        return false;
      }}
    />
  );
};

export default LogInContainer;
