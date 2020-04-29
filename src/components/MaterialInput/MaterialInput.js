import React, { useState } from 'react';
import classnames from 'classnames';
import { getPasswordSite } from '../../shared/utils';

import './MaterialInput.scss';

const MaterialInput = ({ hasError, value, handleChange, handleKeyUp, label, attr, error }) => {
  const onChange = (event) => {
    const { target: { value } = {} } = event;
    if (handleChange && typeof handleChange === 'function') {
      handleChange(value);
    }
  };

  return (
    <div className="MaterialInput">
      <div className="Form__group Field">
        <input
          type="input"
          className={classnames('Form__field', {
            'Form__field_is-filled': value,
            has_error: !!error,
          })}
          placeholder={label}
          onChange={onChange}
          onKeyUp={handleKeyUp}
          {...attr}
          required
          value={value}
        />
        <label htmlFor={attr.id} className={classnames('Form__label', { has_error: !!error })}>
          {label}
        </label>
        {error && <p className="MaterialInput__error">{error}</p>}
      </div>
    </div>
  );
};

export default MaterialInput;
