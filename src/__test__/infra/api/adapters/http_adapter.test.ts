import {expect, it, describe, beforeEach} from '@jest/globals';
import {anyString} from '../../../helpers/fakes';
import {UnexpectedError} from '../../../../domain/erros/unexpecte_error';
import {StatusCode} from '../../../../infra/api/contracts/client';
import {SessionExpiredError} from '../../../../domain/erros/sesstion_expired_error';
import {ClientSpy} from '../clients/client_spy';
import {HttpAdapter} from '../../../../infra/api/adapters/http_adapter';

describe('HttpAdapter', () => {
  let client: ClientSpy;
  let sut: HttpAdapter;
  let url: string;

  beforeEach(() => {
    client = new ClientSpy();
    sut = new HttpAdapter(client);
    url = anyString();
  });

  describe('get', () => {
    it('should request with correct method', async () => {
      await sut.get({url});
      expect(client.method).toBe('get');
      expect(client.callsCount).toBe(1);
    });

    it('should request with correct url', async () => {
      await sut.get({url});
      expect(client.url).toBe(url);
    });

    it('should request with default headers', async () => {
      await sut.get({url});
      expect(client?.headers['content-type']).toBe(`application/json`);
      expect(client?.headers['accept']).toBe(`application/json`);
    });

    it('should append headers', async () => {
      const headers = {
        h1: 'value1',
        h2: 'value2',
        h3: 1234,
      };

      await sut.get({url, headers});
      expect(client?.headers['content-type']).toBe(`application/json`);
      expect(client?.headers['accept']).toBe(`application/json`);
      expect(client?.headers['h1']).toBe(`value1`);
      expect(client?.headers['h2']).toBe(`value2`);
      expect(client?.headers['h3']).toBe('1234');
    });

    it('should request with correct params', async () => {
      url = 'http://any_url.com/:param1/:param2';
      await sut.get({
        url,
        params: {
          param1: 'value1',
          param2: 'value2',
        },
      });
      expect(client.url).toBe('http://any_url.com/value1/value2');
    });

    it('should request with optional param', async () => {
      url = 'http://any_url.com/:param1/:param2';
      await sut.get({
        url,
        params: {
          param1: 'value1',
          param2: null,
        },
      });
      expect(client.url).toBe('http://any_url.com/value1');
    });

    it('should request with correct queryString', async () => {
      await sut.get({
        url,
        queryString: {
          query1: 'value1',
          query2: 'value2',
        },
      });
      expect(client.url).toBe(`${url}?query1=value1&query2=value2`);
    });

    it('should request with correct queryString and params', async () => {
      url = 'http://any_url.com/:param3/:param4';

      await sut.get({
        url,
        queryString: {
          query1: 'value1',
          query2: 'value2',
        },
        params: {
          param3: 'value3',
          param4: 'value4',
        },
      });
      expect(client.url).toBe(
        `http://any_url.com/value3/value4?query1=value1&query2=value2`,
      );
    });

    it('should throw UnexpectedError on status 400', async () => {
      client.statusCode = StatusCode.BadRequestError;

      const response = sut.get({url});
      expect(response).rejects.toThrow(new UnexpectedError());
    });

    it('should throw SessionExpiredError on status 401', async () => {
      client.statusCode = StatusCode.UnauthorizedError;
      const response = sut.get({url});
      expect(response).rejects.toThrow(new SessionExpiredError());
    });

    it('should throw UnexpectedError on status 403', async () => {
      client.statusCode = StatusCode.ForbiddenError;
      const response = sut.get({url});
      expect(response).rejects.toThrow(new UnexpectedError());
    });

    it('should throw UnexpectedError on status 404', async () => {
      client.statusCode = StatusCode.NotFoundError;
      const response = sut.get({url});
      expect(response).rejects.toThrow(new UnexpectedError());
    });

    it('should throw UnexpectedError on status 500', async () => {
      client.statusCode = StatusCode.ServerError;
      const response = sut.get({url});
      expect(response).rejects.toThrow(new UnexpectedError());
    });

    it('should return on Map', async () => {
      client.response = {
        key1: 'value1',
        key2: 'value2',
      };

      const data = await sut.get<{key1: string; key2: string}>({url});

      expect(data['key1']).toBe('value1');
      expect(data['key2']).toBe('value2');
    });

    it('should return correct response on array', async () => {
      client.response = [{key1: 'value1'}, {key2: 'value2'}];

      const data = await sut.get<Array<{key1: string; key2: string}>>({url});

      expect(data[0]['key1']).toBe('value1');
      expect(data[1]['key2']).toBe('value2');
    });

    it('should return correct response a Map with Array', async () => {
      client.response = {
        key1: 'value1',
        key2: [{key1: 'value1'}, {key2: 'value2'}],
      };

      const data = await sut.get({url});

      expect(data['key1']).toBe('value1');
      expect(data['key2'][0]['key1']).toBe('value1');
      expect(data['key2'][1]['key2']).toBe('value2');
    });
  });
});
