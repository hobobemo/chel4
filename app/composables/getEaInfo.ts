export function getPlayerConsoleName(value: string){
    switch (value) {
      case 'xbsx':
        return 'XBOX';
        break;
      case 'ps5':
        return 'Playstation';
        break;
    }
}

export function getPlayerPositionName(value: string){
  switch (value) {
    case 'center':
      return 'Center';
      break;
    case 'leftWing':
      return 'Left Wing';
      break;
    case 'rightWing':
      return 'Right Wing';
      break;
    case 'defenseMen':
      return 'Defense';
      break;
    case 'goalie':
      return 'Goalie';
      break;
  }
}

export function getPlayerPositionAbbr(value: string){
  switch (value) {
    case 'center':
      return 'C';
      break;
    case 'leftWing':
      return 'LW';
      break;
    case 'rightWing':
      return 'RW';
      break;
    case 'defenseMen':
      return 'D';
      break;
    case 'goalie':
      return 'G';
      break;
  }
}

export function getTeamLogo(value: object) {
    switch (value?.useBaseAsset) {
      case '1':
        if(value?.crestAssetId > 1000){
          return 'https://media.contentapi.ea.com/content/dam/ea/nhl/nhl-20/common/pro-clubs/t1000.png'
        } else {
          return `https://media.contentapi.ea.com/content/dam/eacom/nhl/pro-clubs/custom-crests/${value?.crestAssetId}.png`
        }
        break;
      case '0':
        return `https://media.contentapi.ea.com/content/dam/eacom/nhl/pro-clubs/crests/t${value?.crestAssetId}.png`;
        break;
    }
}
