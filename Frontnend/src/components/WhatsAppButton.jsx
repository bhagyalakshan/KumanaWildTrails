import React from 'react';
import { Button } from 'react-bootstrap';
import { FaWhatsapp } from 'react-icons/fa';

function WhatsAppButton({ scrolled }) {
  return (
    <Button
      variant="success"
      href="https://wa.me/+94777946022"
      target="_blank"
      rel="noopener noreferrer"
      className="d-flex align-items-center rounded-pill gap-2"
      style={{
        backgroundColor: '#25D366', 
        padding: '18px 28px',        
        fontSize: '0.95rem',
        border: '4px solid white',   
      }}
    >
      <FaWhatsapp size={22} />
      {!scrolled && <span className="d-none d-md-inline">WhatsApp</span>}
    </Button>
  );
}

export default WhatsAppButton;
