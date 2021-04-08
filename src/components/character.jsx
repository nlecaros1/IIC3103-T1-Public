// isMobile: https://stackoverflow.com/questions/21660369/detectmobilebrowsers-how-to-add-ipad-co-detect-mobile-browsers-js
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Button, ButtonGroup, ButtonToolbar, Container, Divider, List, Loader } from 'rsuite';
import axios from 'axios';
import colors from '../styles/colors';

const isMobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)));


const Character = ({
  commonApiUrl,
  location,
}) => {
  const params = useParams();
  const history = useHistory();
  const { id: formattedName } = params; 
  const name = formattedName.replace(/\+/g, ' ');
  const show = location?.state?.show ? location.state.show : 'Breaking Bad';
  const isBreakingBad = show === 'Breaking Bad';
  const [isBreakingBadSeason, setIsBreakingBadSeason] = useState(isBreakingBad);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [breakingBadAppearance, setBreakingBadAppearance] = useState([]);
  const [betterCallSaulAppearance, setBetterCallSaulAppearance] = useState([]);
  const [appearance, setAppearance] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [img, setImg] = useState('');
  const [nickname, setNickname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [portrayed, setPortrayed] = useState('');
  const [status, setStatus] = useState('');

  
  const charactersUrl = `${commonApiUrl}/characters?name=${formattedName}`;

  const quotesUrl = `${commonApiUrl}/quote?author=${formattedName}`

  const loadCharacter = () => ( axios.get(charactersUrl) )

  const loadQuotes = () => ( axios.get(quotesUrl) )


  useEffect( () => {
    setIsLoading(true);
    const getData = async () => {
      await Promise.all([
        loadCharacter(),
        loadQuotes('Breaking Bad'),
        loadQuotes('Better Call Saul'),
      ])
      .then((values) => {
        const [
          characterResponse,
          quotesResponse,
        ] = [
          values[0].data,
          values[1].data,
        ];
        if (characterResponse.length) {
          const character = characterResponse[0];
          setBreakingBadAppearance(character.appearance);
          setBetterCallSaulAppearance(character.better_call_saul_appearance);
          setAppearance(isBreakingBad ? character.appearance : character.better_call_saul_appearance);
          setImg(character.img);
          setNickname(character.nickname);
          setOccupation(character.occupation);
          setPortrayed(character.portrayed);
          setStatus(character.status)
        } else {
          setIsEmpty(true)
        }
        if (quotesResponse.length) {
          setQuotes(quotesResponse);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        history.push('/error', { error })

      });
    }
    getData()
  },
  [params]);

  const handleSeasonClick = (season) => {
    history.push('/', { 
      season,
      show: isBreakingBadSeason ? 'Breaking Bad' : 'Better Call Saul' })
  }

  const handleShowClick = (show) => {
    history.push('/', { 
      show: isBreakingBadSeason ? 'Breaking Bad' : 'Better Call Saul' })
  }

  const handleChangeShowSeasonClick = (appearanceToUse, mode) => {
    setAppearance(appearanceToUse);
    setIsBreakingBadSeason(mode === 'Breaking Bad')
  }

  const getImageDimensions = () => {
    const height = 20 * occupation.length + 8 * (occupation.length - 1)  + 34 + 187 + 40
    return height;
  }

  return(
    <Container>
      {isLoading ? (
        <Loader center content="Cargando"/>
      ) : (
        <Container>
          {isEmpty ? (
            <Container>
            <h1>Lo sentimos, no tenemos registro de {name} en {show}. Revisa que su nombre este bien escrito.</h1>
            </Container>
          ) : (
            <Container style={styles.generalContainer}>
              <Container style={styles.imageAndInformationContainer}>
                <Container style={styles.generalInformationContainer}>
                  <Container>
                    <Container>
                      <h3>{name}</h3>
                    </Container>
                    <Divider style={{color: colors.gray}}/>
                    <Container style={styles.informationContainer}>
                      <p style={styles.informationText}>- Apodo: {nickname}</p>
                      <p style={styles.informationText}>- Estado: {status}</p>
                      <p style={styles.informationText}>- Actor/Actriz{portrayed}</p>
                    </Container>
                  </Container>
                  <Container>
                    <h4>Ocupaciones</h4>
                      {occupation.map((item, index) => (
                        <p key={index.toString()} style={styles.informationText}>- {item}</p>
                      ))}
                  </Container>
                </Container>
                <Container>
                  <img 
                    src={img}
                    height={isMobile ? getImageDimensions() - 50 : getImageDimensions()}
                    alt={name}
                    width={isMobile ? getImageDimensions() - 50 : getImageDimensions()}
                    style={styles.image}
                    />
                </Container>
              </Container>
              <Container>
                <Container style={styles.seasonsContainer}>
                  <h4 style={styles.text}>Temporadas</h4>
                  <Container>
                    <ButtonToolbar style={styles.buttons}>
                      <ButtonGroup>
                        <Button
                          active={isBreakingBadSeason}
                          appearance="default"
                          onClick={() => handleChangeShowSeasonClick(breakingBadAppearance, 'Breaking Bad')}
                          >Breaking Bad
                        </Button>
                        <Button
                          active={!isBreakingBadSeason}
                          appearance="default"
                          onClick={() => handleChangeShowSeasonClick(betterCallSaulAppearance, 'Better Call Saul')}
                          >
                          Better Call Saul
                        </Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                    <Divider />
                    {appearance.length ? (
                      <ButtonToolbar style={styles.buttons}>
                        {appearance.map((item, index) => (
                          <Button key={index.toString()} index={index} onClick={() => handleSeasonClick(item)}>
                            {item}
                          </Button>
                        ))}
                      </ButtonToolbar>
                    ): (
                      <p style={styles.text}>No aparece en ninguna temporada</p>
                    )}
                  </Container>
                </Container>
              </Container>

              <Container>
                <Container style={styles.quotesContainer}>
                  <h4 style={styles.text}>Frases</h4>
                  <Container>
                    <Divider />
                    {quotes.length ? (
                      <Container style={styles.buttons}>
                        {quotes.map((item, index) => (
                          <p key={index.toString()} index={index} style={{ fontStyle: 'italic' }} onClick={() => handleShowClick(item.series)}>
                            - "{item.quote}" - {item.series}
                          </p>
                        ))}
                      </Container>
                    ): (
                      <p style={styles.text}>No tiene ninguna.</p>
                    )}
                  </Container>
                </Container>
              </Container>


            </Container>
          )}
        </Container>
      )}
    </Container>
  )
};

const styles = {
  text: { textAlign: 'center' },
  buttons: { alignSelf: 'center' },
  seasonsContainer: { margin: 10, marginTop: 20 },
  image: {
    borderRadius: isMobile ? 10 : 0, 
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10, 
    alignSelf: isMobile ? 'center' : 'flex-end',
    marginBottom: isMobile ? 20 : 0,
  },
  informationText: { marginLeft: 10 },
  informationContainer: { backgroundColor: colors.black, margin: 10 },
  generalInformationContainer: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  imageAndInformationContainer: {
    flexDirection: isMobile ? 'column': 'row',
    borderRadius: 10,
    backgroundColor: colors.black,
    color: colors.white,
  },
  generalContainer: { margin: 10 },
  quotesContainer: { marginTop: 20, padding: 20, color: colors.white, backgroundColor: colors.black, borderRadius: 10 },
}

export default Character;