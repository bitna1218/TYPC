export type PartsInventory = {
  [category: string]: {
    [brand: string]: string[];
  };
};
  
  // 부품 재고 데이터
  export const partsInventoryData: PartsInventory = {
    'CASE': {
      'ASUS': ['PRIME A320M-K', 'TUF Gaming A520M'],
      '1stPlayer': ['Mi5', 'White Case Pro'],
      '컬러풀': ['White Gaming Case', 'RGB Case']
    },
    'PSU': {
      '맥스엘리트': ['듀오 700W', '듀오 850W'],
      'ASUS': ['650W 80+ Gold', '750W 80+ Platinum'],
      '컬러풀': ['600W Modular', '800W RGB']
    },
    'VGA': {
      '컬러풀': ['RTX4060Ti 화이트', 'RTX4070 Super'],
      'ASUS': ['RTX4080 TUF', 'RTX4090 ROG'],
      'MSI': ['RTX4060 Gaming X', 'RTX4070Ti Gaming']
    },
    'SSD': {
      '솔리다임': ['P44 Pro 1TB', 'P44 Pro 512G'],
      '삼성': ['980 PRO 1TB', '970 EVO Plus 2TB'],
      'WD': ['Black SN850X 1TB', 'Blue 500GB']
    },
    'CPU': {
      'AMD': ['라이젠 7500F', '라이젠 5 7600X'],
      'Intel': ['i5-12400F', 'i7-13700K'],
      '인텔': ['i9-13900K', 'i3-12100F']
    },
    'M/B': {
      'ASUS': ['PRIME B650M-A II', 'TUF Gaming B550M'],
      'MSI': ['MAG B550M', 'PRO B450M'],
      'ASRock': ['B450M Steel Legend', 'X570 Phantom']
    },
    'RAM': {
      '팀그룹': ['DDR5 5600 32G(16*2)', 'DDR4 3200 16GB'],
      '삼성': ['DDR5 6000 32GB', 'DDR4 2666 8GB'],
      'G.SKILL': ['Trident Z 32GB', 'Ripjaws V 16GB']
    }
  };