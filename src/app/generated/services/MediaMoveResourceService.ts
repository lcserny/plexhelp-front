/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaMoveError } from '../models/MediaMoveError';
import type { MediaMoveRequest } from '../models/MediaMoveRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MediaMoveResourceService {

    /**
     * @param requestBody
     * @returns MediaMoveError OK
     * @throws ApiError
     */
    public static moveMedia(
        requestBody?: MediaMoveRequest,
    ): CancelablePromise<Array<MediaMoveError>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media-moves',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
