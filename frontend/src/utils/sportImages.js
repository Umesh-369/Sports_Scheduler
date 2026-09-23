import footballImg from '../assets/sports/football.jpg';
import basketballImg from '../assets/sports/basketball.jpg';
import tennisImg from '../assets/sports/tennis.jpg';
import cricketImg from '../assets/sports/cricket.jpg';
import volleyballImg from '../assets/sports/volleyball.jpg';
import badmintonImg from '../assets/sports/badminton.jpg';

export const SPORT_IMAGES = {
  Football: footballImg,
  Basketball: basketballImg,
  Tennis: tennisImg,
  Cricket: cricketImg,
  Volleyball: volleyballImg,
  Badminton: badmintonImg
};

export const getSportImage = (sportName) => {
  if (!sportName) return footballImg;
  return SPORT_IMAGES[sportName] || footballImg;
};

export const SPORT_EMOJIS = {
  Football: '⚽',
  Basketball: '🏀',
  Tennis: '🎾',
  Cricket: '🏏',
  Volleyball: '🏐',
  Badminton: '🏸'
};

export const getSportEmoji = (sportName) => {
  return SPORT_EMOJIS[sportName] || '🏆';
};
