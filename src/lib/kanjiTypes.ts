export interface KanjiItem {
  _id?: string;
  index: number;
  character: string;
  sinoVietnameseWord: string;
  mean: string;
  reminiscentImageUrl?: string;
  reminiscentDescription?: string;
  onReading?: string;
  kunReading?: string;
  examples?: string;
}

export interface KanjiN5Row {
  index: number;
  character: string;
  sinoVietnameseWord: string;
  mean: string;
}
