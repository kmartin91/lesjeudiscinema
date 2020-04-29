import React, { useState } from 'react';
import classnames from 'classnames';
import { getPasswordSite } from '../../shared/utils';
import MaterialInput from '../MaterialInput/MaterialInput';

import './Login.scss';

const Login = ({ handleCorrect }) => {
  const [password, setPassword] = useState(undefined);
  const [errorPassword, setErrorPassword] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [errorUser, setErrorUser] = useState(undefined);

  const handleSubmit = () => {
    if (!user) {
      setErrorUser('Bah alors gros nigaud, on oublie de renseigner son prénom');
      return false;
    }
    if (!password) {
      setErrorPassword('Je crois que tu as oublié le mot de passe');
      return false;
    }
    if (password === getPasswordSite()) {
      setErrorPassword(undefined);
      if (handleCorrect && typeof handleCorrect === 'function') {
        handleCorrect(user);
      }
    } else {
      setErrorPassword('Oups mot de passe incorrect');
    }
  };

  const handleKeyUp = (event) => {
    const { keyCode } = event;
    if (keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div className="Login">
      <MaterialInput
        hasError={!!errorUser}
        value={user}
        handleChange={setUser}
        label="Prénom"
        attr={{ id: 'login' }}
        error={errorUser}
      />
      <MaterialInput
        hasError={!!errorPassword}
        value={password}
        handleChange={setPassword}
        label="Password"
        attr={{ id: 'password' }}
        error={errorPassword}
        handleKeyUp={handleKeyUp}
      />
      <button onClick={handleSubmit} className="Login__button">
        Entrer
      </button>
    </div>
  );
};

export default Login;
