import axios from 'axios';

import Backend from './Backend';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Backend', () => {
  describe('getFavorites', () => {
    test('page does not exist', async () => {
      const favorites = [
        {
          owner: 1,
          object_id: 'c3658581-eb1e-4212-9443-2ab615fb27b6',
          type: 'page',
        },
        { owner: -1, object_id: 'made-up', type: 'page' },
      ];
      mockedAxios.get.mockResolvedValueOnce({
        data: favorites,
      });
      mockedAxios.get.mockResolvedValueOnce({
        data: [{ object_id: 'c3658581-eb1e-4212-9443-2ab615fb27b6' }],
      });
      const backend = new Backend();
      const result = await backend.getFavorites();
      expect(result.length).toEqual(1);
    });
  });
});
