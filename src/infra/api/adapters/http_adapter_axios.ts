import axios from 'axios';
import {HttpResponse, IClient} from '../contracts/client';

export class HttpAdapterAxios implements IClient {
  async get(url: string, headers?: any): Promise<HttpResponse> {
    const response = await axios.get(url, {headers});
    return {
      statusCode: response.status,
      data: response.data,
    };
  }
}
