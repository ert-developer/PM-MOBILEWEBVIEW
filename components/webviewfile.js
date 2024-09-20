import React, { useState, useEffect, useRef } from 'react';
import { View, BackHandler, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

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

    // Allow Firebase/Google URLs to proceed in WebView
    if (
      navState.url.includes('firebaseapp.com/__/auth/handler') ||
      navState.url.includes('accounts.google.com') ||
      navState.url.includes('oauth2')
    ) {
      return true;
    }
    return false;
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://fantasy-prime-minister-web.onrender.com/' }}
        injectedJavaScript={`
          (function() {
            var interval = setInterval(function() {
              var googleBtn = document.querySelector('.googleButton');
              var facebookBtn = document.querySelector('.facebookButton');
              if (googleBtn || facebookBtn) {
                if (googleBtn) googleBtn.style.display = 'none';
                if (facebookBtn) facebookBtn.style.display = 'none';
                window.ReactNativeWebView.postMessage("Buttons hidden");
                clearInterval(interval);
              } else {
                window.ReactNativeWebView.postMessage("Buttons not found yet");
              }
            }, 1000); // Check every second
          })();
        `}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        onNavigationStateChange={handleNavigationChange}
        onMessage={(event) => {
          console.log('Message from WebView:', event.nativeEvent.data);
        }}
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
    </View>
  );
};

export default LogInContainer;
