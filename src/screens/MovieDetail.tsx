import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { API_URL, API_ACCESS_TOKEN } from '@env';
import MovieList from '../components/movies/MovieList';

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movie, setMovie] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    fetchMovieData();
    fetchRecommendations();
  }, []);

  const fetchMovieData = (): void => {
    const url = `${API_URL}/movie/${id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        console.log('Movie Detail Response:', response); 
        setMovie(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchRecommendations = (): void => {
    const url = `${API_URL}/movie/${id}/recommendations`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        setRecommendations(response.results);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.coverImage}
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        />
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <Text style={styles.detail}>Release Date: {movie.release_date}</Text>
        <Text style={styles.detail}>Rating: {movie.vote_average}</Text>

        <View style={styles.recommendationsContainer}>
          <MovieList
            title="Recommended Movies"
            path={`movie/${id}/recommendations`}
            coverType="poster"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
  },
  coverImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  recommendationsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default MovieDetail;
