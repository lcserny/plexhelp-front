/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LocalDateTime } from './LocalDateTime';
import type { ObjectId } from './ObjectId';

export type DownloadedMedia = {
    id?: ObjectId;
    fileName?: string;
    fileSize?: number;
    dateDownloaded?: LocalDateTime;
};

