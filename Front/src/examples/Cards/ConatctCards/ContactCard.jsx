import React from 'react';
import './ContactCard.module.css';

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

export default ContactCard;
