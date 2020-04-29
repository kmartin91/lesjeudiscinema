/* @flow */

import React, { useState, useRef, useEffect } from 'react';
import _get from 'lodash/get';
import axios from 'axios';
import { getMovieApi, getMovieImgUrl } from '../../shared/utils';
import useDebounce from '../../hooks/useDebounce';
import MaterialInput from '../MaterialInput/MaterialInput';

import './MovieSearcher.scss';

type PropTypes = {
  handleSubmit: Function,
  title?: string,
};

/**
 * MovieSearcher
 */
const MovieSearcher = ({ handleSubmit, title }: PropTypes) => {
  const isSubscribed = useRef();
  const movieCallRef = useRef();
  const [searchTerm, setSearchTerm] = useState(title || '');
  const [imagePoster, setImagePoster] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [isSelectedMovie, setIsSelectedMovie] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const resultsMovies = _get(moviesList, 'results', []);
  const onChangeSearchTerm = (value) => {
    setSearchTerm(value);
    setMoviesList([]);
    setIsSelectedMovie(false);
  };

  const handleItem = ({ title, poster }) => () => {
    setSearchTerm(title);
    setImagePoster(poster);
    setMoviesList([]);
    setIsSelectedMovie(true);
  };

  const onSubmit = () => {
    if (handleSubmit && typeof handleSubmit === 'function') {
      handleSubmit({ title: searchTerm, poster: imagePoster });
      setSearchTerm('');
      setMoviesList([]);
      setIsSelectedMovie(false);
    }
  };

  useEffect(() => {
    isSubscribed.current = true;

    return () => {
      isSubscribed.current = false;
      if (movieCallRef.current) {
        movieCallRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    async function getMovieInformation() {
      try {
        movieCallRef.current = axios.CancelToken.source();
        await axios
          .get(
            `https://api.themoviedb.org/3/search/movie?api_key=${getMovieApi()}&query=${
              debouncedSearchTerm || ''
            }&page=1&language=fr-FR`,
          )
          .then(({ data }) => {
            if (isSubscribed.current) {
              setMoviesList(data);
            }
          });
      } catch (error) {}
    }

    if (debouncedSearchTerm && !isSelectedMovie) {
      getMovieInformation();
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="MovieSearcher">
      <div className="MovieSearcher__input">
        <MaterialInput
          type="text"
          handleChange={onChangeSearchTerm}
          value={searchTerm}
          label="Rechercher un film"
          attr={{ id: 'movieSearchInput' }}
        />
        {isSelectedMovie && (
          <button onClick={onSubmit} className="MovieSearcher__button">
            Soumettre votre proposition
          </button>
        )}
        {resultsMovies && resultsMovies.length > 0 && (
          <ul className="MovieSearcher__suggestion">
            {resultsMovies
              .slice(0, 5)
              .map(({ poster_path: image, original_title: title, release_date: date }) => (
                <li
                  className="MovieSearcher__suggestionItem"
                  onClick={handleItem({ title, poster: image })}
                  key={`${title}-${date}`}
                >
                  {image ? (
                    <img
                      className="MovieSearcher__suggestionItemImg"
                      src={`${getMovieImgUrl()}${image}`}
                      alt={title}
                    />
                  ) : (
                    <span>No image </span>
                  )}
                  <span className="MovieSearcher__suggestionItemTitle">
                    {title} {date ? `(${date.split('-')[0]})` : ''}
                  </span>
                </li>
              ))}
            <li></li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default MovieSearcher;
