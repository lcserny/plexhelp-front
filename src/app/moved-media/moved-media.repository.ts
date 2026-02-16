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

    findAllByMediaTypeAndDateAndMediaName(searchType: MediaFileType, searchDate: Date | null, searchMediaName: string): MovedMedia[] {
        let allMedia = this.findAll();
        return allMedia.filter(movedMedia =>
            movedMedia.mediaType === searchType
                    && movedMedia.mediaName === searchMediaName
                    && this.areDatesEqual(movedMedia.date, searchDate)
        );
    }

    findAllByMediaTypeAndDateAndMediaNameAndSeason(searchType: MediaFileType, searchDate: Date | null, searchMediaName: string, searchSeason: number): MovedMedia[] {
        let allMedia = this.findAll();
        return allMedia.filter(movedMedia =>
            movedMedia.mediaType === searchType
                    && movedMedia.mediaName === searchMediaName
                    && movedMedia.season === searchSeason
                    && this.areDatesEqual(movedMedia.date, searchDate)
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

    private areDatesEqual(date1: Date | null, date2: Date | null): boolean {
        if (date1 === null && date2 === null) {
            return true;
        }
        if (!date1 || !date2) {
            return false;
        }
        return date1.getTime() === date2.getTime();
    }
}
