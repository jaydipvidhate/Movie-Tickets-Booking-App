import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {APP_BASE_URL, APP_API_KEY, APP_POSTER_URL} from '@env';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const MyTickets = ({navigation}) => {
  const [moviesData, setMoviesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      getTicketsDataFromStorage();
    });
    return unsub;
  }, [navigation]);

  const getTicketsDataFromStorage = async () => {
    setIsLoading(true);
    let items = await AsyncStorage.getItem('tickets');
    items = JSON.parse(items);
    let movies = [];
    if (items) {
      for (let index = 0; index < items?.length; index++) {
        await axios
          .get(`${APP_BASE_URL}/movie/${items[index]}?api_key=${APP_API_KEY}`)
          .then(movie => {
            movies.push(movie.data);
          })
          .catch(err => console.log(err));
      }
      setMoviesData(movies);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#1A1A23',
        paddingVertical: 20,
        position: 'relative',
      }}>
      <FlatList
        data={moviesData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingBottom: 70,
          justifyContent: 'center',
          zIndex: 1,
          position: 'relative',
          alignItems: 'center',
        }}
        ListHeaderComponent={() => {
          return (
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                position: 'relative',
              }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 30,
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                My
              </Text>
              <Text style={{color: '#ffffff', fontSize: 30, fontWeight: '300'}}>
                Tickets
              </Text>
            </View>
          );
        }}
        ListFooterComponent={() => {
          return (
            <>
              {isLoading && (
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 40,
                  }}>
                  <ActivityIndicator size="small" color="#ffffff20" />
                </View>
              )}
            </>
          );
        }}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MovieDetails', {movieId: item.id})
              }
              activeOpacity={0.9}
              style={{
                backgroundColor: 'transparent',
                width: '86%',
                aspectRatio: 3.5 / 2,
                marginVertical: 20,
                marginRight: 6,
              }}>
              <LinearGradient
                colors={['#23252F', '#13141B']}
                style={{
                  width: '100%',
                  height: '100%',
                  padding: 14,
                  elevation: 1,
                  shadowColor: '#ffffff',
                  position: 'relative',
                  flexDirection: 'row',
                  borderRadius: 30,
                }}>
                <Image
                  source={{uri: APP_POSTER_URL + item?.poster_path}}
                  style={{
                    height: '100%',
                    aspectRatio: 2 / 3,
                    backgroundColor: 'gray',
                    borderRadius: 15,
                    marginRight: 20,
                  }}
                />
                <View style={{flex: 1, justifyContent: 'space-around'}}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 19,
                      maxHeight: 64,
                      overflow: 'hidden',
                    }}>
                    {item.original_title}
                  </Text>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                      <Icon
                        name="star"
                        style={{color: '#F9AC2B', marginRight: 6}}
                      />
                      <Text style={{color: '#F9AC2B', fontSize: 12}}>
                        {item?.vote_count?.toString()}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: '#ffffff',
                        opacity: 0.4,
                        fontSize: 12,
                        maxHeight: 20,
                        overflow: 'hidden',
                      }}>
                      {item.release_date}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#F9AC2B',
                      borderRadius: 100,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      position: 'absolute',
                      bottom: 26,
                      right: -34,
                    }}>
                    <Text style={{color: '#000000', fontWeight: '500'}}>
                      IMDB {item?.vote_average?.toString().slice(0, 3)}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default MyTickets;
