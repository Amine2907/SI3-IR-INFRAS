import React from 'react';
import './ContactCard.module.css';
import PropTypes from 'prop-types';
const ContactCard = ({ contact, onEdit }) => {
  return (
    <div className="contact-card">
      <h3>{contact.name}</h3>
      <p>Email: {contact.email}</p>
      <p>Phone: {contact.phone}</p>
      <p>Position: {contact.position}</p>
      <button onClick={() => onEdit(contact)}>Edit</button>
    </div>
  );
};
ContactCard.propTypes = {
  contact: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default ContactCard;
