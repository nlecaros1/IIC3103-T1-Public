import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Button, ButtonToolbar, Container, List, Loader, Icon } from 'rsuite';
import axios from 'axios';
import moment from 'moment';
import colors from '../styles/colors';

const Episode = ({
  commonApiUrl,
}) => {
  const params = useParams();
  const episodeId = params.id;
  const history = useHistory()
  const url = `${commonApiUrl}/episodes/${episodeId}`;
  const [isLoading, setIsLoading] = useState(true);
  const [airDate, setAirDate] = useState('');
  const [title, setTitle] = useState('');
  const [season, setSeason] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [serie, setSerie] = useState('');
  const [characters, setCharacteers] = useState([]);

  useEffect(() => {
    axios.get(url)
      .then((response) => {
        const episode = response.data[0];
        setAirDate(episode.air_date);
        setTitle(episode.title);
        setSeason(episode.season);
        setEpisodeNumber(episode.episode);
        setSerie(episode.series);
        setCharacteers(episode.characters);
        setIsLoading(false);
      })
      .catch((error) => {
        history.push('/error', { error })
      });
  },
  []);

  const handleCharacterClick = (character) => {
    history.push(`/character/${character.replace(/ /g, '+')}`, { show: serie})
  }

  return (
    <Container style={styles.generalContainer}>
      {isLoading ? (
        <Loader center content="Cargando" />
      ) : (
        <Container>
          <Container>
            <h2>
              {season}
              x
              {episodeNumber}
              {' '}
              -
              {' '}
              {title}
            </h2>
          </Container>
          <Container style={styles.information}>
            <Container>
              <p onClick={() => history.push('/', { show: serie, season })}>
                Temporada:
                {' '}
                {season}
              </p>
              <p>
                Capítulo:
                {' '}
                {episodeNumber}
              </p>
            </Container>
            <Container>
              <p>
                Lanzada:
                {' '}
                {moment(airDate).format('DD/MM/YYYY')}
              </p>
              <p onClick={() => history.push('/', { show: serie })}>
                Serie:
                {' '}
                {serie}
            </p>
            </Container>

          </Container>
          <Container style={styles.characters}>
            <h4>Personajes {<Icon icon="user" size="2x"/>}</h4>
              {characters.map((item, index) => (
                <ButtonToolbar
                  key={index.toString()}
                  onClick={() => handleCharacterClick(item)}
                  style={styles.character}
                  >
                  <Button appearance="subtle">{index + 1}</Button>
                  <Button appearance="subtle">{item}</Button>
                </ButtonToolbar>
              ))}
          </Container>
          </Container>
      )}
    </Container>
  );
};

const styles = {
  generalContainer: { margin: 10 },
  character: { flex: 1, width: '100%' },
  characters: { padding: 10 },
  information: {
    backgroundColor: colors.black,
    color: colors.white,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    flexDirection: 'row'
  },
}
export default Episode;
