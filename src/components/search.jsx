import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import { Button, Container, Loader, List, Modal, IconButton, Icon, Whisper, Tooltip, Avatar, ButtonToolbar, ButtonGroup, Divider, Alert } from 'rsuite';
import axios from 'axios';

const Search = ({
  commonApiUrl,
  location,
}) => {
  const defaultOffset = 10;
  const defaultLimit = 10;
  const params = useParams();
  let { name: formattedName, offset } = params;
  if (offset < 0) {
    Alert.error('La página no puede ser menor a 0.')
    offset = 0;
  }
  const hasPrevious = location?.state?.hasPrevious || offset > 0;
  const name = formattedName.replace(/\+/g, ' ');
  const history = useHistory()
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [hasNext, sethasNext] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const url = `${commonApiUrl}/characters?name=${formattedName}&limit=${defaultLimit}&offset=${offset}`;
  
  useEffect(() => {
    setIsLoading(true)
    axios.get(url)
      .then((response) => {
        const temporalCharacters = [];
        if (response.data.length) {
          if (response.data.length >= defaultLimit) {
            sethasNext(true);
          } 
          response.data.forEach((character) => {
            temporalCharacters.push({
              name: character.name,
              imageSource: character.img,
              appearances: {
                breakingBad: character.appearance.length > 0,
                betterCallSaul: character.better_call_saul_appearance.length > 0
              }
            })
          })
          setIsEmpty(false)
          setCharacters(temporalCharacters)
        } else {
          setIsEmpty(true)
        }
        setIsLoading(false);
      })
      .catch((error) => {
        history.push('/error', { error })
      });
  },
  [params]);

  const handleNext = () => {
    history.push(`/search/${formattedName}/${parseInt(offset) + defaultOffset}`, {hasPrevious: true})
  }
  const handlePrevious = () => {
    history.push(`/search/${formattedName}/${parseInt(offset) - defaultOffset}`)
  }

  const handleCharacterClick = (character) => {
    history.push(`/character/${character.name.replace(/ /g, '+')}`)
  }

  return(
    <Container style={styles.generalContainer}>
      <h2>Resultados para: {name}</h2>
      {isLoading ? (
        <Loader center content="Cargando"/>
      ) : (
        <Container>
          <Divider/>
          {isEmpty ? (
            <Container>
              {hasPrevious ? (
                <Container>
                  <h4 style={styles.text}>No hay más resultados</h4>
                  {offset > 0 && hasPrevious && (
                    <Container>
                      <Divider/>
                      <Button style={styles.buttons} onClick={handlePrevious}>Anterior</Button>
                    </Container>
                  )}
                </Container>
              ) : (
                <h4 style={styles.text}>No hay resultados</h4>
              )}
            </Container>
          ): (
            <Container>
              <Container style={styles.generalContainer}>
                  {characters.map((item, index) => (
                    <ButtonToolbar key={index.toString()} style={styles.character} onClick={() => handleCharacterClick(item)}>
                      <ButtonGroup justified key={ (10 * index).toString() }>
                        <Button active style={styles.buttonAvatar}  key={ (10 * index + 1).toString() }>
                          <Avatar circle src={item.imageSource}/>
                        </Button>
                        <Button active style={styles.buttonName}  key={ (10 * index + 2).toString() }>
                          {item.name}
                        </Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  ))}
              </Container>
              <Container>
                <Divider/>
                <ButtonToolbar style={styles.buttons}>
                  {offset > 0 && hasPrevious && <Button onClick={handlePrevious}>Anterior</Button>}
                  {!isEmpty && hasNext && <Button onClick={handleNext}>Siguiente</Button>}
                </ButtonToolbar>
              </Container>
            </Container>
          )}
        </Container>
      )}
    </Container>
  )
}

const styles = {
  generalContainer: { margin: 10 },
  buttons: { alignSelf: 'center' },
  buttonName: { flex: 3, textAlign: 'left' },
  buttonAvatar: { flex: 1 },
  character: { margin: 2 },
  text: { textAlign: 'center' },


}
export default Search;