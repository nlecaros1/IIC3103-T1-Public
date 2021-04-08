import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button, Container } from 'rsuite';

const ErrorComponent = ({
  location
}) => {

  const handleClick = () => {
    history.push('/');
  }
  const error = location?.state?.error;
  const history = useHistory();
  console.log(error, error === undefined)
  if (error === undefined) {
    handleClick();
  }
  return(
    <Container>
      {error !== undefined && (
      <Container>
        <h2>Lo sentimos, hubo un error con la API. Trate nuevamente.</h2>
        <p>{error.status}</p>
        <p>{error.message}</p>
        <Button onClick={handleClick} >Inicio</Button>
      </Container>
      )}
      </Container>
  )
}

export default ErrorComponent;