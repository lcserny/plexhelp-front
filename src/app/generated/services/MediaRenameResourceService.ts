/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaRenameRequest } from '../models/MediaRenameRequest';
import type { RenamedMediaOptions } from '../models/RenamedMediaOptions';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MediaRenameResourceService {

    /**
     * @param requestBody
     * @returns RenamedMediaOptions OK
     * @throws ApiError
     */
    public static produceRenames(
        requestBody?: MediaRenameRequest,
    ): CancelablePromise<RenamedMediaOptions> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media-renames',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
