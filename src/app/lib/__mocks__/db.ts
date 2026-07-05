export const db = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  account: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  session: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};
