import { isLearnPage } from '../NavigationBar/helpers/isLearnPage';
import { isLoginPage } from '../NavigationBar/helpers/isLoginPage';

export const canShowNavbar = (path: string) =>
  !isLearnPage(path) && !isLoginPage(path);
