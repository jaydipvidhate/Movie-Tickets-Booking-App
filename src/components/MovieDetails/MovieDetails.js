import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {APP_BASE_URL, APP_API_KEY, APP_POSTER_URL} from '@env';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MovieDetails = ({route, navigation}) => {
  const {movieId} = route.params;

  const WIDTH = Dimensions.get('screen').width;
  const HEIGHT = Dimensions.get('screen').height;

  const [movieDetails, setMovieDetails] = useState('');
  const [movieProviders, setMovieProviders] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBuy, setIsBuy] = useState(true);

  useEffect(() => {
    getMovieDetailsByID(movieId);
    getItemsInStorageData(movieId);
  }, [movieId]);

  const getMovieDetailsByID = async movieId => {
    setIsLoading(true);
    const movie = await axios
      .get(`${APP_BASE_URL}/movie/${movieId}?api_key=${APP_API_KEY}`)
      .then(res => setMovieDetails(res.data), getMovieProviders(movieId))
      .catch(err => console.log(err));
    setIsLoading(false);
  };

  const getMovieProviders = async id => {
    setIsLoading(true);
    let movieProArr = [];
    const providers = await axios
      .get(`${APP_BASE_URL}/movie/${id}/watch/providers?api_key=${APP_API_KEY}`)
      .then(async provider => {
        movieProArr.push(
          provider.data.results.IN?.flatrate
            ? provider.data.results.IN.flatrate
            : null,
        );
      });
    setMovieProviders(movieProArr[0] ? movieProArr[0] : null);
    setIsLoading(false);
  };

  const hour = Math.floor(movieDetails?.runtime / 60);
  const min = movieDetails?.runtime - hour * 60;

  const handelAddTicket = async id => {
    setIsLoading(true);
    let itemsArr = await AsyncStorage.getItem('tickets');
    itemsArr = JSON.parse(itemsArr);
    if (itemsArr) {
      let arr = itemsArr;
      arr.push(id);
      try {
        await AsyncStorage.setItem('tickets', JSON.stringify(arr));
        setTimeout(() => {
          setIsBuy(false);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        return error;
      }
    } else {
      let arr = [];
      arr.push(id);
      try {
        await AsyncStorage.setItem('tickets', JSON.stringify(arr));
        setTimeout(() => {
          setIsBuy(false);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        return error;
      }
    }
  };

  const handelRemoveTicket = async id => {
    setIsLoading(true);
    let itemArr = await AsyncStorage.getItem('tickets');
    itemArr = JSON.parse(itemArr);
    if (itemArr) {
      let arr = itemArr;
      for (let index = 0; index < arr?.length; index++) {
        if (arr[index] == id) {
          arr.splice(index, 1);
        }
        await AsyncStorage.setItem('tickets', JSON.stringify(arr));
      }
      setTimeout(() => {
        setIsBuy(true);
        setIsLoading(false);
      }, 500);
    }
  };

  const getItemsInStorageData = async movieId => {
    setIsLoading(true);
    let items = await AsyncStorage.getItem('tickets');
    items = JSON.parse(items);
    if (items) {
      for (let index = 0; index < items?.length; index++) {
        if (items[index] == movieId) {
          setIsBuy(false);
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1A1A23',
        position: 'relative',
      }}>
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#262532',
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Ionic name="chevron-back" style={{fontSize: 18, color: '#ffffff'}} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            color: '#ffffff',
            marginLeft: '25%',
          }}>
          Movie Details
        </Text>
      </View>
      <View
        style={{width: WIDTH, alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            width: WIDTH * 0.72,
            height: HEIGHT * 0.5,
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#ffffff20',
          }}>
          <Image
            source={{uri: APP_POSTER_URL + movieDetails?.poster_path}}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
          {movieProviders && (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: '#ffffff20',
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 1,
              }}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                  borderRadius: 8,
                }}
                source={{uri: APP_POSTER_URL + movieProviders[0]?.logo_path}}
              />
            </View>
          )}
        </View>
        <Text
          style={{
            fontSize: 24,
            color: '#ffffff',
            maxWidth: WIDTH * 0.6,
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 20,
          }}>
          {movieDetails?.original_title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: WIDTH * 0.7,
            marginBottom: 20,
          }}>
          <Text style={{color: '#ffffff', fontSize: 12, opacity: 0.4}}>
            {movieDetails?.release_date?.toString().slice(0, 4)}
          </Text>
          <Text style={{color: '#ffffff', fontSize: 12, opacity: 0.4}}>
            {movieDetails?.genres ? movieDetails.genres[0].name : null}
          </Text>
          <Text style={{color: '#ffffff', fontSize: 12, opacity: 0.4}}>
            {hour + 'hr' + ' ' + min + 'min'}
          </Text>
        </View>
        <View
          style={{
            width: WIDTH,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingHorizontal: 80,
            marginBottom: 30,
          }}>
          <Text
            style={{
              color: '#ffffff',
              fontWeight: 'bold',
              letterSpacing: 2,
            }}>
            IMDB {movieDetails?.vote_average?.toString().slice(0, 3)}
          </Text>
        </View>
        <View
          style={{
            width: WIDTH,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>
              isBuy ? handelAddTicket(movieId) : handelRemoveTicket(movieId)
            }
            style={{
              width: WIDTH * 0.5,
              paddingVertical: 10,
              backgroundColor: isBuy ? '#ffffff' : '#ff0000',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              position: 'relative',
            }}>
            <View
              style={{
                width: 18,
                aspectRatio: 1 / 1,
                borderRadius: 100,
                backgroundColor: '#1A1A23',
                position: 'absolute',
                left: -12,
                top: '50%',
              }}></View>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                style={{
                  color: isBuy ? '#000000' : '#ffffff',
                  fontWeight: 'bold',
                  letterSpacing: 2,
                  fontSize: 14,
                }}>
                {isBuy ? 'Buy Tickets' : 'Cancel'}
              </Text>
            )}
            <View
              style={{
                width: 18,
                aspectRatio: 1 / 1,
                borderRadius: 100,
                backgroundColor: '#1A1A23',
                position: 'absolute',
                right: -12,
                top: '50%',
              }}></View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: WIDTH,
          height: HEIGHT * 0.5,
          position: 'absolute',
          zIndex: -1,
          opacity: 1,
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={['#1A1A2300', '#1A1A2390', '#1A1A23', '#1A1A23']}
          style={{
            width: WIDTH,
            height: 80,
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
          }}></LinearGradient>
        <Image
          source={{uri: APP_POSTER_URL + movieDetails?.backdrop_path}}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            opacity: 0.2,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MovieDetails;
