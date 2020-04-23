import React, { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import PasswordInput from "../PasswordInput/PasswordInput";

import { getMoviesPropals } from "../../services/firebase";
import { getWeekNumber } from "../../shared/utils";

import "../../shared/css/common.scss";
import "./Main.scss";

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );

const Main = () => {
  const [cookies, setCookie] = useCookies(["lesjeudiscinema"]);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const weekNumber = getWeekNumber();
  // Using state to refresh when password is ok
  const [cookieAuth, setCookieAuth] = useState(cookies.auth);
  const { propositions = [] } = data;
  const groupedPropositions = groupBy(propositions, "user");

  useEffect(() => {
    if (cookieAuth) {
      getMoviesPropals().then((propositionsList) => {
        if (propositionsList.exists) {
          setError(null);
          setData(propositionsList.data());
        } else {
          setError(`propositions-not-found-in-week-${weekNumber}`);
          setData({});
        }
      });
    }
  }, [cookieAuth]);

  const handleCorrect = () => {
    setCookie("auth", true);
    setCookieAuth(true);
  };

  return (
    <div className="Main">
      <div className="Main__logo">Les jeudis cinéma</div>
      <div className="Main__content">
        {!cookieAuth ? (
          <PasswordInput handleCorrect={handleCorrect} />
        ) : (
          <React.Fragment>
            <div className="Main__helper"></div>
            <div className="Main__propals">
              <ul className="Main__userList">
                {Object.keys(groupedPropositions).map((user) => {
                  const item = groupedPropositions[user] || [];
                  return (
                    <li key={user} className="Main__user">
                      {user}
                      <ol className="Main__movie">
                        {item.map(({ title }) => (
                          <li key={`${user}-${title}`} className="Main__movie">
                            {title}
                          </li>
                        ))}
                      </ol>
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
