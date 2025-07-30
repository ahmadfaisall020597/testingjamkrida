import React from 'react';
import { Card } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import PropTypes from 'prop-types';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  growth, 
  onClick 
}) => {
  return (
    <Card 
      className="h-100 shadow-sm border-0 stat-card" 
      onClick={onClick} 
      style={{ cursor: 'pointer' }}
    >
      <Card.Body className="d-flex align-items-center">
        <div className={`stat-icon bg-${color} text-white rounded-circle d-flex align-items-center justify-content-center me-3`}>
          {icon}
        </div>
        <div className="flex-grow-1">
          <h3 className="mb-1 fw-bold text-dark">
            {value?.toLocaleString()}
          </h3>
          <p className="text-muted mb-1">{title}</p>
          <small className="text-muted">{subtitle}</small>
          {growth && (
            <div className="mt-1">
              <small className={`text-${growth >= 0 ? 'success' : 'danger'}`}>
                {growth >= 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(growth)}%
              </small>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

// PropTypes validation
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  subtitle: PropTypes.string,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  growth: PropTypes.number,
  onClick: PropTypes.func
};

StatCard.defaultProps = {
  value: 0,
  subtitle: '',
  growth: null,
  onClick: () => {}
};

export default StatCard;