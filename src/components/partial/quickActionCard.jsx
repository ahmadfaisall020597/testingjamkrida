import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const QuickActionCard = ({ 
  title, 
  description, 
  icon, 
  color, 
  onClick 
}) => {
  return (
    <Card 
      className="h-100 shadow-sm border-0 action-card" 
      onClick={onClick} 
      style={{ cursor: 'pointer' }}
    >
      <Card.Body className="text-center">
        <div className={`action-icon bg-${color} text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`}>
          {icon}
        </div>
        <h6 className="fw-bold mb-2">{title}</h6>
        <p className="text-muted small mb-0">{description}</p>
      </Card.Body>
    </Card>
  );
};

// PropTypes validation
QuickActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

QuickActionCard.defaultProps = {
  onClick: () => {}
};

export default QuickActionCard;