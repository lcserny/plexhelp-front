/**
 * auth-service API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { UserData } from './userData';


export interface PaginatedUsers { 
    data?: Array<UserData>;
    page?: number;
    hasMore?: boolean;
}

