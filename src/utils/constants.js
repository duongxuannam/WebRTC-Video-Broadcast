export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
};

export const NAME_LEVELS = {
  DIAMOND: 'diamond',
  GOLD: 'gold',
  TITAN: 'titan',
  SILVER: 'silver',
};

export const LEVELS = {
  diamond: {
    name: 'diamond',
    xPoint: 2,
    scopeMin: 3000,
  },
  gold: {
    name: 'gold',
    xPoint: 2,
    scopeMin: 1500,
    scopeMax: 3000,
  },
  titan: {
    name: 'titan',
    xPoint: 1.5,
    scopeMin: 500,
    scopeMax: 1500,
  },
  silver: {
    name: 'silver',
    xPoint: 1,
    scopeMin: 0,
    scopeMax: 500,
  },
};
