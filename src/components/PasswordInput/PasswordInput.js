import React, { useState } from "react";
import classnames from "classnames";
import { getPasswordSite } from "../../shared/utils";

import "./PasswordInput.scss";

const PasswordInput = ({ handleCorrect }) => {
  const [password, setPassword] = useState(undefined);
  const [error, setError] = useState(undefined);

  const handleChange = (event) => {
    const { target: { value } = {} } = event;
    setPassword(value);
  };

  const handleSubmit = () => {
    if (password === getPasswordSite()) {
      setError(undefined);
      if (handleCorrect && typeof handleCorrect === "function") {
        handleCorrect();
      }
    } else {
      setError("Oups mot de passe incorrect");
    }
  };

  const handleKeyUp = (event) => {
    const { keyCode } = event;
    if (keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div className="PasswordInput">
      <div className="Form__group Field">
        <input
          type="input"
          className={classnames("Form__field", {
            "Form__field_is-filled": password,
            has_error: !!error,
          })}
          placeholder="Mot de passe"
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          name="password"
          id="password"
          required
        />
        <label
          htmlFor="password"
          className={classnames("Form__label", { has_error: !!error })}
        >
          Mot de passe
        </label>
        {error && <p className="PasswordInput__error">{error}</p>}
      </div>

      <button onClick={handleSubmit} className="PasswordInput__button">
        Entrer
      </button>
    </div>
  );
};

export default PasswordInput;
