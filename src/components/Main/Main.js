/* @flow */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import classnames from 'classnames';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';

import Login from '../Login/Login';

import SVGCheck from '../../shared/svg/checked.svg';
import SVGClose from '../../shared/svg/close.svg';

import MovieSearcher from '../MovieSearcher/MovieSearcher';
import 'react-toastify/dist/ReactToastify.css';

import {
  getMoviesPropals,
  addPropal,
  streamMoviesPropals,
  streamMoviesVotes,
  addOrRemoveVote,
  getPropalById,
} from '../../services/firebase';
import { getWeekNumber, getMaxPropal, getMaxVote, getMovieImgUrl } from '../../shared/utils';
import useDebounce from '../../hooks/useDebounce';

import '../../shared/css/common.scss';
import './Main.scss';

const MAX_PROPAL = getMaxPropal();
const MAX_VOTE = getMaxVote();

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {},
  );

const Main = () => {
  const [cookies, setCookie] = useCookies(['lesjeudiscinema']);
  const [propositions, setPropositions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [error, setError] = useState(null);
  const [movieUpdateId, setMovieUpdateId] = useState('');
  const [movieUpdateTitle, setMovieUpdateTitle] = useState('');
  const weekNumber = getWeekNumber();
  // Using state to refresh when password is ok
  const [cookieAuth, setCookieAuth] = useState(cookies.auth);
  const [cookieUser, setCookieUser] = useState(cookies.user);
  const groupedPropositions = groupBy(propositions, 'user');
  const votesByUser = votes.filter(({ user }) => user === cookieUser);
  const canVote = votesByUser.length < MAX_VOTE;

  useEffect(() => {
    if (cookieAuth) {
      const unsubscribe = streamMoviesPropals(weekNumber, {
        next: (querySnapshot) => {
          const propals = querySnapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          }));
          setError(null);
          setPropositions(propals);
        },
        error: () => {
          setError(`propositions-not-found-in-week-${weekNumber}`);
          setPropositions([]);
        },
      });
      return unsubscribe;
    }
  }, [setPropositions, cookieAuth]);

  useEffect(() => {
    if (cookieAuth) {
      const unsubscribe = streamMoviesVotes(weekNumber, {
        next: (querySnapshot) => {
          const votes = querySnapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          }));
          setError(null);
          setVotes(votes);
        },
        error: () => {
          setError(`propositions-not-found-in-week-${weekNumber}`);
          setVotes([]);
        },
      });
      return unsubscribe;
    }
  }, [setVotes, cookieAuth]);

  const handleCorrect = (user = '') => {
    setCookie('auth', true);
    setCookie('user', user.toLowerCase());
    setCookieAuth(true);
    setCookieUser(user.toLowerCase());
  };

  const submitPropal = async (movie) => {
    const { title, poster } = movie;
    const { message } = await addPropal(title, getWeekNumber(), cookieUser, poster);

    if (message && message === 'duplicate-item-error') {
      message === 'duplicate-item-error'
        ? toast.warn('Proposition déjà proposée !', {
            position: toast.POSITION.TOP_CENTER,
          })
        : toast.error(`Aie une erreur a eu lieu: ${message}`, {
            position: toast.POSITION.TOP_CENTER,
          });
    } else {
      toast.success('Suggestion ajoutée !', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const toggleVote = async (title) => {
    const { message } = addOrRemoveVote(title, getWeekNumber(), cookieUser, canVote);

    // Remove All dismiss
    toast.dismiss();

    message
      ? toast.error(`Aie une erreur a eu lieu: ${message}`, {
          position: toast.POSITION.TOP_CENTER,
        })
      : toast.success(`Vote soumis pour ${title}`, {
          position: toast.POSITION.TOP_CENTER,
        });
  };

  const prepareUpdate = async (id, title) => {
    setMovieUpdateId(id);
    setMovieUpdateTitle(title);
  };

  const handleUpdate = async (movie) => {
    const { title, poster } = movie;
    await getPropalById(weekNumber, movieUpdateId).update({
      title,
      poster,
    });

    toast.success(`Proposition changée pour ${title}`, {
      position: toast.POSITION.TOP_CENTER,
    });
    setMovieUpdateId('');
    setMovieUpdateTitle('');
  };
  const showUser = (title) => () => {};

  const nbUpPropalRemains = groupedPropositions[cookieUser]
    ? MAX_PROPAL - groupedPropositions[cookieUser].length
    : MAX_PROPAL;

  const nbVotesRemains = MAX_VOTE - votesByUser.length;

  return (
    <div className="Main">
      <ToastContainer autoClose={3000} pauseOnFocusLoss={false} />
      <div className="Main__logo">Les jeudis cinéma</div>
      <div className="Main__content">
        {!cookieAuth || !cookieUser ? (
          <Login handleCorrect={handleCorrect} />
        ) : (
          <React.Fragment>
            <div className="Main__helper">
              <ol>
                <li className="Main__helperLine">
                  {`Toutes les semaines, propose ${MAX_PROPAL} films que tu
                  souhaiterais voir.`}
                </li>
                <li className="Main__helperLine">
                  {`Tu as le droit à ${MAX_VOTE} votes toutes les semaines, choisis
                  bien`}
                </li>
                <li className="Main__helperLine">
                  Le film avec le plus de vote sera le film diffusé le jeudi à 21h30
                </li>
                <li className="Main__helperLine">
                  Pour voir le film, connecte-toi sur Kast en cliquant{' '}
                  <a href="https://s.kast.live/g/2bwc506hlbf" target="_blank">
                    ICI
                  </a>
                </li>
              </ol>
              <div className="Main__helperRemain">
                <p>
                  {nbUpPropalRemains
                    ? `Il te reste encore ${nbUpPropalRemains} propositions de film`
                    : `Aie...tu as déjà proposé ${MAX_PROPAL} films pour cette semaine`}
                </p>
                <p>
                  {canVote
                    ? `Il te reste encore ${nbVotesRemains} votes`
                    : `Aie...tu as déjà voté pour ${MAX_VOTE} films pour cette semaine`}
                </p>
              </div>
            </div>
            {(nbUpPropalRemains > 0 || movieUpdateId) && (
              <React.Fragment>
                <h2>{!movieUpdateId ? 'Tes propositions' : 'Modifier la proposition'}</h2>
                <MovieSearcher
                  handleSubmit={!movieUpdateId ? submitPropal : handleUpdate}
                  title={movieUpdateTitle}
                />
              </React.Fragment>
            )}
            <h2>
              {Object.keys(groupedPropositions).length > 0
                ? 'Les propositions de la semaine :'
                : 'Aucune proposition de film pour cette semaine'}
            </h2>
            <div className="Main__propals">
              <ul className="Main__userList">
                {Object.keys(groupedPropositions).map((user) => {
                  const item = groupedPropositions[user] || [];
                  return (
                    <li key={user} className="Main__userPropal">
                      <span className="Main__username">
                        {user === cookieUser ? 'Tes propositions' : user}
                      </span>
                      <div className="Main__movie">
                        {item.map(({ title, poster, id }) => {
                          const countVote = votes.filter(
                            ({ title: titleVotes }) => titleVotes === title,
                          ).length;
                          const isInVotesUser = votesByUser.find(
                            ({ title: title2, user: user2 }) => title2 === title && user2 === user,
                          );

                          return (
                            <div
                              key={`${user}-${title}`}
                              className="Main__movieTitle"
                              onClick={
                                user !== cookieUser
                                  ? () => toggleVote(title)
                                  : () => prepareUpdate(id, title)
                              }
                              onMouseUp={() => showUser(title)}
                            >
                              {poster && (
                                <img
                                  className="Main__movieImage"
                                  src={`${getMovieImgUrl()}${poster}`}
                                />
                              )}
                              <span className="Main__movieItemTitle">{title}</span>{' '}
                              <span className="Main__movieCount">{countVote} vote(s)</span>
                            </div>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Main;
