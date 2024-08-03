import React from 'react';
import { Appbar, Avatar, Card, Button, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView, View, StyleSheet, ScrollView } from 'react-native';
import tw from "twrnc";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const HomeScreen = () => {
  return (
    <PaperProvider>
      <SafeAreaView style={tw`flex-1`}>
        <Appbar.Header style={styles.header}>
          <View style={styles.headerContent}>
            <Appbar.Content title="Instagram" titleStyle={styles.headerTitle} />
            <Avatar.Image
              size={60}
              source={require('../assets/images/man.png')} 
              style={tw`mt-25 mr-280`}
            />
          </View>
        </Appbar.Header>
        <ScrollView style={styles.content}>
          <Card style={tw`mb-10`}>
            <Card.Title

              title="User name"
              titleStyle={tw`text-lg text-white text-bold`}
              left={(props) => <Avatar.Icon {...props} icon="account" style={tw`bg-white`} labelStyle={{ color: 'black' }} />}
            />
            <Card.Cover source={require('../assets/images/birds.jpg')} style={tw`h-50 w-90 ml-2`} />
            <Card.Actions>
              <Button
              icon={() => <MaterialCommunityIcons name="thumb-up-outline" size={30} color="black" />}
                mode="text"
                onPress={() => console.log('Like Pressed')}
                style={tw`bg-white h-8 w-2`}
                labelStyle={tw`text-black mt-2 ml-1`}
              >
              </Button>
              <Button
               icon={() => <MaterialCommunityIcons name="comment" size={28} color="black" />}
                mode="text"
                onPress={() => console.log('Comment Pressed')}
                style={tw`bg-white h-9 w-2`}
                labelStyle={tw`text-black mt-6 ml-1`}
              >
              </Button>
              <Button
                icon={() => <MaterialCommunityIcons name="send" size={30} color="black" />}
                mode="text"
                onPress={() => console.log('Share Pressed')}
                style={tw`bg-white h-8 mr-35`}
                labelStyle={tw`text-black mt--8 ml-1`}
              >
              </Button>
            </Card.Actions>
          </Card>

          
          <Card style={tw`mb-10`}>
            <Card.Title
              title="Another User"
              titleStyle={tw`text-lg text-white text-bold`}
              left={(props) => <Avatar.Icon {...props} icon="account" style={tw`bg-white`} labelStyle={{ color: 'black' }} />}
            />
            <Card.Cover source={require('../assets/images/ballons.jpg')} style={tw`h-50 w-90 ml-2`} />
            <Card.Actions>
            <Button
              icon={() => <MaterialCommunityIcons name="thumb-up-outline" size={30} color="black" />}
                mode="text"
                onPress={() => console.log('Like Pressed')}
                style={tw`bg-white h-8 w-2`}
                labelStyle={tw`text-black mt-2 ml-1`}
              >
              </Button>
              <Button
               icon={() => <MaterialCommunityIcons name="comment" size={28} color="black" />}
                mode="text"
                onPress={() => console.log('Comment Pressed')}
                style={tw`bg-white h-9 w-2`}
                labelStyle={tw`text-black mt-6 ml-1`}
              >
              </Button>
              <Button
                icon={() => <MaterialCommunityIcons name="send" size={30} color="black" />}
                mode="text"
                onPress={() => console.log('Share Pressed')}
                style={tw`bg-white h-8 mr-35`}
                labelStyle={tw`text-black mt--8 ml-1`}
              >
              </Button>
            </Card.Actions>
          </Card>
          
        </ScrollView>
        <View style={styles.footer}>
          <Button
            icon={() => <Icon name="home" size={32} color="black" />}
            mode="text"
            onPress={() => console.log('Home Pressed')}
            style={tw`bg-white`}
            labelStyle={{ color: 'black' }}
          />
          <Button
            icon={() => <Icon name="search" size={30} color="black" />}
            mode="text"
            onPress={() => console.log('Search Pressed')}
            style={tw`bg-white`}
            labelStyle={{ color: 'black' }}
          />
          <Button
            icon={() => <Icon name="plus-square" size={30} color="black" />}
            mode="text"
            onPress={() => console.log('Add Pressed')}
            style={tw`bg-white`}
            labelStyle={{ color: 'black' }}
          />
          <Button
            icon={() => <Icon name="heart" size={30} color="black" />}
            mode="text"
            onPress={() => console.log('Activity Pressed')}
            style={tw`bg-white`}
            labelStyle={{ color: 'black' }}
          />
          <Button
            icon={() => <Icon name="user-circle" size={30} color="black" />}
            mode="text"
            onPress={() => console.log('Profile Pressed')}
            style={tw`bg-white`}
            labelStyle={{ color: 'black' }}
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontStyle: 'italic',
    color: 'white',
    marginBottom: -20,
    marginRight: 270,
    marginTop: -10,
    fontFamily: 'Instafont',
   
  },
  
  content: {
    flex: 1,
    padding: 10,
  },
  footer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default HomeScreen;
