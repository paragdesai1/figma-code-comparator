/// <reference types="jest" />

type FigmaMock = {
  ui: {
    postMessage: jest.Mock;
    onmessage: jest.Mock;
  };
  closePlugin: jest.Mock;
  notify: jest.Mock;
  showUI: jest.Mock;
  root: {
    children: any[];
  };
  currentPage: {
    selection: any[];
  };
  getNodeById?: jest.Mock;
};

declare global {
  namespace NodeJS {
    interface Global {
      figma: FigmaMock;
      __html__: string;
    }
  }
  
  var figma: FigmaMock;
  var __html__: string;
} 