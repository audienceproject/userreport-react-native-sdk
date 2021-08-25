import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, Switch, StyleSheet} from 'react-native';
import UserReport from '@audienceproject/react-native-userreport-sdk';

UserReport.setDebug(true);
UserReport.configure('audienceproject', '647303c6-e40c-4c8d-ad54-04e2502258f0');

const App = () => {
  const [section, setSection] = useState('');
  useEffect(() => {
    UserReport.trackScreenView();

    if (section === 'section1') {
      UserReport.trackSectionScreenView('1205d37e-319d-44ea-959b-15cd46e46ffa');
    } else if (section === 'section2') {
      UserReport.trackSectionScreenView('c43a981c-7f48-417c-8e52-4966bd3228e7');
    }
  }, [section]);

  const [dnt, setDnt] = useState(false);
  useEffect(() => {
    UserReport.setAnonymousTracking(dnt);
  }, [dnt]);

  const renderRoot = () => (
    <>
      <Text style={styles.subheaderText}>Application</Text>

      <Text style={styles.link} onPress={() => setSection('section1')}>
        Section 1
      </Text>
      <Text style={styles.link} onPress={() => setSection('section2')}>
        Section 2
      </Text>
    </>
  );

  const renderSection = number => (
    <>
      <Text style={styles.subheaderText}>Application → Section {number}</Text>

      <Text style={styles.link} onPress={() => setSection('')}>
        Back
      </Text>
    </>
  );

  return (
    <SafeAreaView style={styles.rootView}>
      <Text style={styles.headerText}>UserReport ReactNative SDK</Text>

      <View style={styles.pageView}>
        {section === '' && renderRoot()}
        {section === 'section1' && renderSection(1)}
        {section === 'section2' && renderSection(2)}
      </View>

      <View style={styles.switchView}>
        <Text style={styles.switchText}>Anonymous Tracking</Text>
        <Switch
          value={dnt}
          onValueChange={() => setDnt(previousValue => !previousValue)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootView: {
    margin: 20,
    flex: 1,
  },
  pageView: {
    flex: 1,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subheaderText: {
    color: 'gray',
    fontSize: 20,
    marginTop: 10,
  },
  link: {
    marginTop: 10,
    color: 'blue',
  },
  switchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  switchText: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default App;
