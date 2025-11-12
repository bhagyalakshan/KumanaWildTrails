import React, { useEffect } from 'react';

const Ninja = () => {
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const scriptId = 'commonninja-sdk';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
      script.defer = true;
      script.id = scriptId;
      document.body.appendChild(script);
    }
  }, []);

  const headerStyle = {
    fontWeight: 700,
    fontSize: isMobile ? '1.8rem' : '2.4rem',
    maxWidth: '600px',
    padding: '5px 24px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 0,
    marginBottom: isMobile ? '10px' : '10px',
    color: 'whitesmoke',
    textAlign: 'center',
    lineHeight: 1.2,
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    WebkitTextStroke: '1px black',
    textStroke: '1px black',
    textShadow:
      '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black',
  };

  const sloganStyle = {
    fontSize: isMobile ? '1rem' : '1.1rem',
    fontWeight: 500,
    color: '#333',
    textAlign: 'center',
    marginBottom: '10px',
    fontStyle: 'italic',
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        padding: '40px 20px',
        borderRadius: '20px',
        maxHeight: '600px',
        overflowY: 'auto',
        margin: '40px auto',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            display: 'inline-block',
            padding: '6px 18px',
            borderRadius: '999px',
            backgroundColor: 'rgba(11, 60, 73, 0.7)',
            color: 'whitesmoke',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '1px',
            marginBottom: '12px',
            backdropFilter: 'blur(5px)',
          }}
        >
          Reviews
        </p>
      </div>
      <h2 style={headerStyle}>Customer Voices</h2>
      <p style={sloganStyle}>Hear what travelers say before you explore with us.</p>
      <div
        className="commonninja_component pid-8a661436-dee9-46ae-acfd-873c709f28de"
        style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '20px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default Ninja;
