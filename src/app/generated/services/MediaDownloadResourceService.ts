/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DownloadedMedia } from '../models/DownloadedMedia';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MediaDownloadResourceService {

    /**
     * @param day
     * @param month
     * @param year
     * @returns DownloadedMedia OK
     * @throws ApiError
     */
    public static downloadsCompleted(
        day?: number,
        month?: number,
        year?: number,
    ): CancelablePromise<Array<DownloadedMedia>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media-downloads',
            query: {
                'day': day,
                'month': month,
                'year': year,
            },
        });
    }

}
