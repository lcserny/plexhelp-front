/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaFileGroup } from '../models/MediaFileGroup';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MediaSearchResourceService {

    /**
     * @returns MediaFileGroup OK
     * @throws ApiError
     */
    public static searchMedia(): CancelablePromise<Array<MediaFileGroup>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media-searches',
        });
    }

}
