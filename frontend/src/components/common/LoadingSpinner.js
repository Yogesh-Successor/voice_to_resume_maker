import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container flex-center" style={{ padding: '40px' }}>
      <div>
        <div className="spinner"></div>
        {message && <p className="text-center mt-2">{message}</p>}
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;

