import { API_BASE, API_POSTS } from "../constants.js";
import { load } from "../../storage/load.js";

export async function getPosts() {
  const response = await fetch(API_BASE + API_POSTS, {
    headers: {
      Authorization: `Bearer ${load