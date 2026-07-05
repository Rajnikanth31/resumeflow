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
  resume: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  resumeVersion: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  profile: {
    upsert: jest.fn(),
  },
  workExperience: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  education: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  project: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  skill: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  customSection: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(async (cb) => {
    return cb(db);
  }),
};
