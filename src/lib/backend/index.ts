import Cookies from 'universal-cookie';
import { captureException } from '@sentry/react';

import {
  GetBlockResponse,
  GetDatabaseResponse,
  GetPageResponse,
  ListBlockChildrenResponse
} from '@notionhq/client/build/src/api-endpoints';
import NotionObject from '../interfaces/NotionObject';
import UserUpload from '../interfaces/UserUpload';
import UserJob from '../interfaces/UserJob';

import getObjectIcon from '../notion/getObjectIcon';
import getObjectTitle from '../notion/getObjectTitle';
import isOfflineMode from '../isOfflineMode';
import handleRedirect from '../handleRedirect';
import { Favorite, Rules, Settings, TemplateFile } from '../types';
import { isDeletedPageResponse } from './isDeletedPageResponse';
import { ConnectionInfo } from '../interfaces/ConnectionInfo';
import { del, get, getLoginURL, post } from './api';

const OK = 200;

class Backend {
  baseURL: string;

  lastCall = new Date();

  constructor() {
    this.baseURL = '/api/';
  }

  async logout() {
    const isOffline = isOfflineMode();
    localStorage.clear();
    sessionStorage.clear();
    if (!isOffline) {
      try {
        const endpoint = `${this.baseURL}users/logout`;
        await get(endpoint);
      } catch (error) {
        captureException(error);
      }
    }
    const cookies = new Cookies();
    cookies.remove('token');
    window.location.href = '/';
  }

  async getNotionConnectionInfo(): Promise<ConnectionInfo> {
    return get(`${this.baseURL}notion/get-notion-link`);
  }

  withinThreeSeconds(): boolean {
    const end = new Date();
    /* @ts-ignore */
    let diff = end - this.lastCall;
    diff /= 1000;
    const seconds = Math.round(diff);
    if (seconds <= 3) {
      return true;
    }
    this.lastCall = new Date();
    return false;
  }

  saveSettings(settings: Settings) {
    return post(
      `${this.baseURL}settings/create/${settings.object_id}`,
      settings
    );
  }

  saveTemplate(templates: TemplateFile[]) {
    return post(`${this.baseURL}templates/create`, { templates });
  }

  deleteTemplates() {
    return post(`${this.baseURL}templates/delete`, {
      credentials: 'include'
    });
  }

  async getSettings(id: string): Promise<Settings | null> {
    const result = await get(`${this.baseURL}settings/find/${id}`);
    if (!result) {
      return null;
    }
    return result.payload;
  }

  saveRules(
    id: string,
    flashcard: string[],
    deck: string[],
    subDecks: string[],
    tags: string,
    email: boolean
  ) {
    const payload = {
      FLASHCARD: flashcard.join(','),
      DECK: deck.join(','),
      SUB_DECKS: subDecks.join(','),
      TAGS: tags,
      EMAIL_NOTIFICATION: email
    };
    return post(`${this.baseURL}rules/create/${id}`, { payload });
  }

  async getRules(id: string): Promise<Rules | null> {
    const findRules = async () => {
      const response = await get(`${this.baseURL}rules/find/${id}`);
      return response;
    };
    const result = await findRules();
    if (!result) {
      return null;
    }
    return result;
  }

  deleteSettings(pageId: string) {
    return post(`${this.baseURL}settings/delete/${pageId}`, {
      object_id: pageId
    });
  }

  async search(query: string, force?: boolean): Promise<NotionObject[]> {
    if (!force && this.withinThreeSeconds()) {
      throw new Error(
        'You are making too many requests. Please wait a few seconds before searching.'
      );
    }
    const favorites = await this.getFavorites();

    const isObjectId = query.replace(/-/g, '').length === 32;
    let data;
    if (isObjectId) {
      const res = await this.getPage(query);
      if (res && res.data) {
        data = {
          results: [res.data]
        };
      } else {
        const dbResult = await this.getDatabase(query);
        if (dbResult && dbResult.data) {
          data = {
            results: [dbResult.data]
          };
        }
      }
    } else {
      const response = await post(`${this.baseURL}notion/pages`, { query });
      data = await response.json();
    }

    if (data && data.results) {
      return data.results.map((p: GetDatabaseResponse | GetPageResponse) => ({
        object: p.object,
        title: getObjectTitle(p).slice(0, 58), // Don't show strings longer than 60 characters
        // @ts-ignore
        icon: getObjectIcon(p),
        // @ts-ignore
        url: p.url as string,
        id: p.id,
        isFavorite: favorites.some((f) => f.id === p.id)
      }));
    }
    return [];
  }

  async getPage(
    pageId: string,
    isFavorite: boolean = false
  ): Promise<NotionObject | null> {
    try {
      const data = await get(`${this.baseURL}notion/page/${pageId}`);
      return {
        object: data.object,
        title: getObjectTitle(data),
        icon: getObjectIcon(data),
        url: data.url as string,
        id: data.id,
        data,
        isFavorite
      };
    } catch (error) {
      if (isDeletedPageResponse(error)) {
        this.deleteFavorite(pageId);
      }
      return null;
    }
  }

  async getDatabase(
    id: string,
    isFavorite: boolean = false
  ): Promise<NotionObject | null> {
    try {
      const data = await get(`${this.baseURL}notion/database/${id}`);
      return {
        object: data.object,
        title: getObjectTitle(data),
        icon: getObjectIcon(data),
        url: data.url as string,
        id: data.id,
        data,
        isFavorite
      };
    } catch (error) {
      return null;
    }
  }

  async renderBlock(blockId: string): Promise<string> {
    return get(`${this.baseURL}notion/render-block/${blockId}`);
  }

  async deleteBlock(blockId: string): Promise<GetBlockResponse> {
    const response = await del(`${this.baseURL}notion/block/${blockId}`);
    return response.json();
  }

  async createBlock(
    parentId: string,
    block: object
  ): Promise<ListBlockChildrenResponse> {
    const response = await post(`${this.baseURL}notion/block/${parentId}`, {
      newBlock: block
    });
    handleRedirect(response);
    return response.json();
  }

  async getBlocks(pageId: string): Promise<ListBlockChildrenResponse> {
    return get(`${this.baseURL}notion/blocks/${pageId}`);
  }

  async getUploads(): Promise<UserUpload[]> {
    return get(`${this.baseURL}upload/mine`);
  }

  async getActiveJobs(): Promise<UserJob[]> {
    return get(`${this.baseURL}upload/active`);
  }

  /**
   * Tell the backend that user wants to delete this upload.
   * @param key upload key to delete
   * @returns whether the deletion was successful or throws an error
   */
  async deleteUpload(key: string): Promise<boolean> {
    try {
      await del(`${this.baseURL}upload/mine/${key}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteJob(id: string) {
    await del(`${this.baseURL}upload/active/${id}`);
  }

  async convert(id: string, type: string) {
    const link = `${this.baseURL}notion/convert/${id}?type=${type}`;
    return fetch(link, { credentials: 'include' });
  }

  async isPatreon(): Promise<boolean> {
    const data = await get(`${this.baseURL}users/is-patreon`);
    return data?.patreon ?? false;
  }

  async addFavorite(id: string, type: string): Promise<boolean> {
    const response = await post(`${this.baseURL}favorite/create`, { id, type });
    return response.status === OK;
  }

  async deleteFavorite(id: string): Promise<boolean> {
    const response = await post(`${this.baseURL}favorite/remove`, { id });
    return response.status === OK;
  }

  async getFavoriteObject(f: Favorite): Promise<NotionObject | null> {
    return f.type === 'page'
      ? this.getPage(f.object_id, true)
      : this.getDatabase(f.object_id, true);
  }

  async getFavorites(): Promise<NotionObject[]> {
    const data = await get(`${this.baseURL}favorite`);
    if (!data) {
      return [];
    }
    const favorites: NotionObject[] = await Promise.all(
      data.map(async (f: Favorite) => this.getFavoriteObject(f))
    );
    return favorites.filter(Boolean);
  }

  async login(email: string, password: string): Promise<Response> {
    const response = await post(getLoginURL(this.baseURL), {
      email,
      password
    });
    return response;
  }

  async forgotPassword(email: string): Promise<void> {
    const endpoint = `${this.baseURL}users/forgot-password`;
    await post(endpoint, { email });
  }

  async newPassword(password: string, token: string): Promise<Response> {
    return post(`${this.baseURL}users/new-password`, {
      password,
      reset_token: token
    });
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<Response> {
    const endpoint = `${this.baseURL}users/register`;
    return post(endpoint, { name, email, password });
  }
}

export default Backend;
