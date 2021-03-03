export type PDFReaderParams = {
  url: string;
}

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  PDFReader: PDFReaderParams;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};
