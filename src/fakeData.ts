type FakeDataType = {
  commit_code: string;
  priority: string;
  aos: number;
  sap: number;
  'aos-cancel': number;
  pending: number;
};

export const fakeData: FakeDataType[] = [
  {
    commit_code: 'Q1',
    priority: '1',
    aos: 5000,
    sap: 4500,
    'aos-cancel': 500,
    pending: 0,
  },
  {
    commit_code: 'Q2',
    priority: '2',
    aos: 2000,
    sap: 1000,
    'aos-cancel': 0,
    pending: 500,
  },
  {
    commit_code: 'Q3',
    priority: '3',
    aos: 2000,
    sap: 500,
    'aos-cancel': 0,
    pending: 1500,
  },
];
