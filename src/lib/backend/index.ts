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
import { get, getLoginURL, post } from './api';

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
        await fetch(endpoint, { credentials: 'include' });
      } catch (error) {
        captureException(error);
      }
    }
    const cookies = new Cookies();
    cookies.remove('token');
    window.location.href = '/';
  }

  async getNotionConnectionInfo(): Promise<ConnectionInfo> {
    const response = await fetch(`${this.baseURL}notion/get-notion-link`, {
      credentials: 'include'
    });
    return response.json();
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
    return post(`${this.baseURL}templates/create`, templates);
  }

  deleteTemplates() {
    return fetch(`${this.baseURL}templates/delete`, {
      credentials: 'include'
    }).then((response) => response.json());
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
      const response = await fetch(`${this.baseURL}notion/page/${pageId}`, {
        credentials: 'include'
      }).then((res) => res.json());
      return {
        object: response.data.object,
        title: getObjectTitle(response.data),
        icon: getObjectIcon(response.data),
        url: response.data.url as string,
        id: response.data.id,
        data: response.data,
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
      const response = await fetch(`${this.baseURL}notion/database/${id}`, {
        credentials: 'include'
      }).then((r) => r.json());
      return {
        object: response.data.object,
        title: getObjectTitle(response.data),
        icon: getObjectIcon(response.data),
        url: response.data.url as string,
        id: response.data.id,
        data: response.data,
        isFavorite
      };
    } catch (error) {
      return null;
    }
  }

  async renderBlock(blockId: string): Promise<string> {
    const response = await fetch(
      `${this.baseURL}notion/render-block/${blockId}`,
      {
        credentials: 'include'
      }
    );
    handleRedirect(response);
    return response.json();
  }

  async deleteBlock(blockId: string): Promise<GetBlockResponse> {
    const response = await fetch(`${this.baseURL}notion/block/${blockId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    handleRedirect(response);
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
    const response = await fetch(`${this.baseURL}notion/blocks/${pageId}`, {
      credentials: 'include'
    });
    return response.json();
  }

  async getUploads(): Promise<UserUpload[]> {
    const response = await fetch(`${this.baseURL}upload/mine`, {
      credentials: 'include'
    });
    handleRedirect(response);
    return response.json();
  }

  async getActiveJobs(): Promise<UserJob[]> {
    const response = await fetch(`${this.baseURL}upload/active`, {
      credentials: 'include'
    });
    return response.json();
  }

  /**
   * Tell the backend that user wants to delete this upload.
   * @param key upload key to delete
   * @returns whether the deletion was successful or throws an error
   */
  async deleteUpload(key: string): Promise<boolean> {
    try {
      await fetch(`${this.baseURL}upload/mine/${key}`, {
        credentials: 'include',
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteJob(id: string) {
    await fetch(`${this.baseURL}upload/active/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
  }

  async convert(id: string, type: string) {
    const link = `${this.baseURL}notion/convert/${id}?type=${type}`;
    return fetch(link, { credentials: 'include' });
  }

  async isPatreon(): Promise<boolean> {
    const response = await fetch(`${this.baseURL}users/is-patreon`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.patreon;
  }

  async addFavorite(id: string, type: string): Promise<boolean> {
    const response = await post(`${this.baseURL}favorite/create`, { id, type });
    return response.status === OK;
  }

  async deleteFavorite(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseURL}favorite/remove`, {
      method: 'DELETE',
      body: JSON.stringify({
        id
      }),
      credentials: 'include'
    });
    return response.status === OK;
  }

  async getFavoriteObject(f: Favorite): Promise<NotionObject | null> {
    return f.type === 'page'
      ? this.getPage(f.object_id, true)
      : this.getDatabase(f.object_id, true);
  }

  async getFavorites(): Promise<NotionObject[]> {
    const response = await fetch(`${this.baseURL}favorite`, {
      credentials: 'include'
    });
    if (!response) {
      return [];
    }
    const data = (await response.json()) ?? [];
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
