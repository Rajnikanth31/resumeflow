export const db: any = {
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
    count: jest.fn(),
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
  conversation: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  message: {
    create: jest.fn(),
  },
  aIRequestLog: {
    create: jest.fn(),
  },
  aISuggestionLog: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  jobDescription: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  aTSReport: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
  resumeJobLink: {
    upsert: jest.fn(),
  },
  coverLetter: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  coverLetterVersion: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  applicationPackage: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(async (cb) => {
    return cb(db);
  }),
};
