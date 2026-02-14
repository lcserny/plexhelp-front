import {Injectable} from '@angular/core';
import {createStore} from "@ngneat/elf";
import {
    getAllEntities,
    getEntity,
    setEntities,
    withEntities
} from "@ngneat/elf-entities";
import {MovedMediaData} from "../generated/commander/model/movedMediaData";
import {MediaFileType} from "../generated/commander/model/mediaFileType";

const storeName = "movedMedia";

export type MovedMedia = Omit<MovedMediaData, 'id' | 'date'> & { id: string; date: Date | null };

@Injectable({providedIn: 'root'})
export class MovedMediaRepository {

    private store = createStore({name: storeName}, withEntities<MovedMedia>());

    saveAll(movedMedia: MovedMedia[]) {
        this.store.update(setEntities(movedMedia));
    }

    findById(id: string): MovedMedia | undefined {
        return this.store.query(getEntity(id));
    }

    findAllByMediaTypeAndMediaName(searchType: MediaFileType, searchMediaName: string): MovedMedia[] {
        let allMedia = this.findAll();
        return allMedia.filter(movedMedia =>
            movedMedia.mediaType === searchType && movedMedia.mediaName === searchMediaName
        );
    }

    findAllByMediaTypeAndMediaNameAndSeason(searchType: MediaFileType, searchMediaName: string, searchSeason: number): MovedMedia[] {
        let allMedia = this.findAll();
        return allMedia.filter(movedMedia =>
            movedMedia.mediaType === searchType && movedMedia.mediaName === searchMediaName && movedMedia.season === searchSeason
        );
    }

    findAll(): MovedMedia[] {
        let items = this.store.query(getAllEntities());
        if (!items) {
            return [];
        }
        return items;
    }

    findAllByMediaNameSubstr(searchMediaName: string): MovedMedia[] {
        let allMedia = this.findAll();
        const lowerSelectedName = searchMediaName.toLowerCase();
        return allMedia.filter(movedMedia =>
            movedMedia.mediaName?.toLowerCase().includes(lowerSelectedName)
        );
    }
}
