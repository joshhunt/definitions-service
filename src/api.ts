import dotenv from "dotenv";

import fetch from "node-fetch";

import * as api from "bungie-api-ts/destiny2/api";
import { HttpClientConfig } from "bungie-api-ts/http";
import { ServerResponse } from "bungie-api-ts/common";
import {
  DestinyProfileResponse,
  DestinyManifest
} from "bungie-api-ts/destiny2";

dotenv.config();

const API_KEY = process.env.BUNGIE_API_KEY;

async function $http(config: HttpClientConfig) {
  var searchParams = new URLSearchParams();

  config.params &&
    Object.entries(config.params).forEach(([key, value]) => {
      searchParams.append(key, value as string);
    });

  const url = `${config.url}?${searchParams.toString()}`;

  const options = {
    method: config.method,
    headers: {
      "x-api-key": API_KEY || ""
    }
  };

  const res = await fetch(url, options);

  return res.json();
}

export async function getProfile(config: api.GetProfileParams) {
  const response: ServerResponse<DestinyProfileResponse> = await api.getProfile(
    $http,
    config
  );
  ``;
  return response.Response;
}

export const getManifest = async () => {
  const response: ServerResponse<
    DestinyManifest
  > = await api.getDestinyManifest($http);

  return response.Response;
};
