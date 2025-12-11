import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  onClick,
  ...props 
}) => {
  const classes = ['card', className].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;

