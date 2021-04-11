import React, { useState, useEffect } from 'react';
import { Container, Loader, Button, ButtonToolbar, ButtonGroup, Alert, } from 'rsuite';
import axios from 'axios'
import { useHistory } from 'react-router';
import moment from 'moment';
import colors from '../styles/colors';

const Show = ({
  commonApiUrl, season, showName, isMobile,
}) => {
  const history = useHistory()
  const expandedSeason = season;
  const formattedName = showName.replace(/ /g, '+');;
  const url = `${commonApiUrl}/episodes?series=${formattedName}`
  const [isLoading, setIsLoading] = useState(true);
  const [seasons, setSeasons] = useState({});
  const [selectedSeason, setSelectedSeason] = useState(expandedSeason !== undefined ? expandedSeason : '');

  const formatDataToSeasons = (data) => {
    const temporalSeasons = {}
    data.forEach((episode) => {
      const episodeSeason = episode.season;
      if (episodeSeason in temporalSeasons) {
        temporalSeasons[episodeSeason].children.push(formatEpisodeToTree(episode))
      } else {
        temporalSeasons[episodeSeason] = {
          label: `Temporada ${episodeSeason}`,
          value: episodeSeason,
          children: [formatEpisodeToTree(episode)],
          position: -1,
      }
    }});
    return temporalSeasons;
  }

  const formatEpisodeToTree = (episode) => ({
    label: `${episode.title}`,
    value: episode.episode_id,
    ...episode
  })

  const formatSeasonsToTree = (seasons) => {
    const seasonAsArray = [];
    Object.keys(seasons).forEach((seasonNumber) => {
      const position = seasonAsArray.push(seasons[seasonNumber])
      seasons[seasonNumber].position = position - 1;
    })
    return(seasonAsArray)
  }

  useEffect(() => {
    axios.get(url)
      .then((response) => {
          const temporalSeasonsAsObject = formatDataToSeasons(response.data)
          const temporalSeasonsAsArray = formatSeasonsToTree(temporalSeasonsAsObject)
          setSeasons(temporalSeasonsAsArray);
          if (expandedSeason) {
            let actualSeasonToBeExpanded = -1;
            temporalSeasonsAsArray.forEach((element) => {
              if (element.value.toString() === expandedSeason.toString()) {
                actualSeasonToBeExpanded = element.position
              }
            });
            if (actualSeasonToBeExpanded === -1) {
              setSelectedSeason('');
              Alert.error(`Lo sentimos, no existe la temporada ${expandedSeason}`);
            } else {
              setSelectedSeason(actualSeasonToBeExpanded)
            }
          }
          setIsLoading(false)
      })
      .catch((error) => {
        history.push('/error', { error })
      });
    }, 
  []);

  const Season = ({ season }) => {
    return(
      <Button
        appearance="subtle"
        active={season.position === selectedSeason}
        onClick={() => {
          setSelectedSeason(season.position)}}
        >
          {season.label}
        </Button>
    )
  };
  const Episode = ({ episode, index }) => {
    return(
      <ButtonToolbar
        onClick={() => history.push(`/episode/${episode.value}`)}
        style={styles.episodes}
        key={episode.value.toString()}
      >
        <ButtonGroup
          key={episode.value.toString() + '-1'}
          justified
          >
            <Button
              appearance={'subtle'}
              key={episode.value.toString() + '-2'}
              >
                {index}
            </Button>
            <Button
              appearance={'subtle'}
              >
                {episode.label}
            </Button>
            {!isMobile && (

              <Button
                key={episode.value.toString() + '-3'}
                appearance={'subtle'}>
                  {episode.characters.length}
              </Button>
            )}
            {!isMobile && (
                <Button
                key={episode.value.toString() + '-4'}
                appearance={'subtle'}>
                  {moment(episode.air_date).format('DD/MM/YYYY')}
              </Button>
            )}
          </ButtonGroup>
    </ButtonToolbar>
    )
  };

  return(
    <Container>
      {isLoading ? 
      <Container> 
        <Loader center content="Cargando" backdrop/> 
      </Container>
    : (
      <Container>
        <Container style={{flexDirection: isMobile ? 'column' : 'row'}}>
          <Container style={{flex: 1}}> 
            <h2 style={styles.textCenter}>Temporadas</h2>
            <Button appearance="subtle" style={{color: colors.white}} onClick={() => setSelectedSeason('')}>''</Button>
            {seasons.map((season) => {
              return(
                <Season
                  season={season}
                  />
              )
            })}
          </Container>
          <Container style={{flex: 2}}> 
            <h2 style={{textAlign: 'center'}}>Capítulos</h2>
            {selectedSeason !== ''? (
              <Container>
                <ButtonToolbar
                    style={styles.episodes}
                  >
                    <ButtonGroup justified>
                      <Button
                        appearance={'default'}
                        >
                          Número
                        </Button>
                      <Button
                        appearance={'default'}
                        >
                          Nombre
                        </Button>
                      {!isMobile && (
                        <Button>
                          # Personajes
                        </Button>
                      )}
                    {!isMobile && (
                      <Button
                        appearance={'default'}
                        >
                        Lanzamiento
                      </Button>
                      )}
                    </ButtonGroup>
                </ButtonToolbar>
              {
              seasons[selectedSeason].children.map((episode, index) => {
              return(
                <Episode
                  episode={episode}
                  index={index + 1}
                  key={index.toString()}
                  />
              )
            })}
            </Container>) : (
              <p style={styles.textCenter}>Selecciona una temporada</p>
            )}
          </Container>
        </Container>
      </Container>
    )}
    </Container>
  )
}

const styles = {
  title: { textAlign: 'center', fontSize: 20, marginBottom: 15 },
  card: {
    flex: 1, width: '100%', hover: 'pointer',
  },
  panel: {
    display: 'inline-block', position: 'relative', width: '100%', flex: 1
  },
  image: { objectFit: 'cover', filter: 'brightness(70%)', alignSelf: 'center' },
  textCenter: {textAlign: 'center'},
  episodes: {flex: 1, width: '100%'},
};

export default Show;