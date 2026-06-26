import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DatePipe} from '@angular/common';
import {MovedMediaService, MovedMediaView, sortOptions} from './moved-media.service';
import {MovedMedia, MovedMediaRepository} from './moved-media.repository';
import {MessageService} from '../message.service';
import {environment} from '../../environments/environment';
import {MediaFileType} from '../generated/commander/model/mediaFileType';
import {MovedMediaData} from '../generated/commander/model/movedMediaData';

describe('MovedMediaService', () => {
    let service: MovedMediaService;
    let httpMock: HttpTestingController;
    let mockRepository: jasmine.SpyObj<MovedMediaRepository>;
    let mockMessageService: jasmine.SpyObj<MessageService>;

    const apiUrl = environment.commanderApiUrl;
    const testDate1 = new Date('2023-01-15');
    const testDate2 = new Date('2023-06-20');
    const testDate3 = new Date('2023-03-10');

    const mockMovieMedia: MovedMedia[] = [
        {
            id: '1', mediaName: 'Alpha Movie', mediaType: MediaFileType.Movie,
            date: testDate1, season: undefined, episode: undefined,
            mediaDesc: {posterUrl: '/alpha.jpg', description: 'Alpha desc', cast: ['Actor1']}
        },
        {
            id: '2', mediaName: 'Beta Movie', mediaType: MediaFileType.Movie,
            date: testDate2, season: undefined, episode: undefined,
            mediaDesc: {posterUrl: '/beta.jpg', description: 'Beta desc', cast: ['Actor2']}
        },
        {
            id: '3', mediaName: 'Charlie Movie', mediaType: MediaFileType.Movie,
            date: testDate3, season: undefined, episode: undefined,
            mediaDesc: undefined
        }
    ];

    const mockTVMedia: MovedMedia[] = [
        {
            id: '4', mediaName: 'TV Show', mediaType: MediaFileType.Tv,
            date: testDate1, season: 1, episode: 1,
            mediaDesc: {posterUrl: '/tv.jpg', description: 'TV desc', cast: ['Actor3']}
        },
        {
            id: '5', mediaName: 'TV Show', mediaType: MediaFileType.Tv,
            date: testDate1, season: 1, episode: 2,
            mediaDesc: {posterUrl: '/tv.jpg', description: 'TV desc', cast: ['Actor3']}
        },
        {
            id: '6', mediaName: 'TV Show', mediaType: MediaFileType.Tv,
            date: testDate1, season: 2, episode: 1,
            mediaDesc: {posterUrl: '/tv.jpg', description: 'TV desc', cast: ['Actor3']}
        }
    ];

    beforeEach(() => {
        mockRepository = jasmine.createSpyObj('MovedMediaRepository', [
            'saveAll', 'removeAll', 'findAll', 'findById',
            'findAllByMediaNameSubstr', 'findAllByMediaTypeAndDateAndMediaName',
            'findAllByMediaTypeAndDateAndMediaNameAndSeason', 'removeById'
        ]);
        mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                MovedMediaService,
                DatePipe,
                {provide: MovedMediaRepository, useValue: mockRepository},
                {provide: MessageService, useValue: mockMessageService}
            ]
        });

        service = TestBed.inject(MovedMediaService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('refreshMovedMedia', () => {
        it('should fetch moved media from API and save to repository', async () => {
            const mockData: MovedMediaData[] = [
                {id: '10', mediaName: 'Fetched Movie', mediaType: MediaFileType.Movie, date: '1700000000'}
            ];

            const promise = service.refreshMovedMedia();
            const req = httpMock.expectOne(`${apiUrl}/media-moves`);
            expect(req.request.method).toBe('GET');
            expect(req.request.withCredentials).toBeTrue();
            expect(req.request.headers.get('Content-Type')).toBe('plain/text');
            req.flush(mockData);

            await promise;

            expect(mockRepository.removeAll).toHaveBeenCalled();
            expect(mockRepository.saveAll).toHaveBeenCalled();
            const saved = mockRepository.saveAll.calls.first().args[0] as MovedMedia[];
            expect(saved.length).toBe(1);
            expect(saved[0].id).toBe('10');
            expect(saved[0].date).toEqual(new Date(1700000000 * 1000));
            expect(mockMessageService.add).toHaveBeenCalledWith('1 movedMedia(s) retrieved', 'INFO');
        });

        it('should handle HTTP error', async () => {
            const promise = service.refreshMovedMedia();
            const req = httpMock.expectOne(`${apiUrl}/media-moves`);
            req.error(new ProgressEvent('error'), {status: 500, statusText: 'Server Error'});

            await expectAsync(promise).toBeRejected();
            expect(mockRepository.removeAll).not.toHaveBeenCalled();
            expect(mockRepository.saveAll).not.toHaveBeenCalled();
        });

        it('should convert epoch date string to Date object', async () => {
            const mockData: MovedMediaData[] = [
                {id: '20', mediaName: 'Test', mediaType: MediaFileType.Movie, date: '0'}
            ];

            const promise = service.refreshMovedMedia();
            const req = httpMock.expectOne(`${apiUrl}/media-moves`);
            req.flush(mockData);
            await promise;

            const saved = mockRepository.saveAll.calls.first().args[0] as MovedMedia[];
            expect(saved[0].date).toEqual(new Date(0));
        });

        it('should convert null date to null', async () => {
            const mockData: MovedMediaData[] = [
                {id: '30', mediaName: 'Test', mediaType: MediaFileType.Movie, date: undefined}
            ];

            const promise = service.refreshMovedMedia();
            const req = httpMock.expectOne(`${apiUrl}/media-moves`);
            req.flush(mockData);
            await promise;

            const saved = mockRepository.saveAll.calls.first().args[0] as MovedMedia[];
            expect(saved[0].date).toBeNull();
        });

        it('should use "<noId>" fallback when id is missing', async () => {
            const mockData: MovedMediaData[] = [
                {mediaName: 'No ID', mediaType: MediaFileType.Movie}
            ];

            const promise = service.refreshMovedMedia();
            const req = httpMock.expectOne(`${apiUrl}/media-moves`);
            req.flush(mockData);
            await promise;

            const saved = mockRepository.saveAll.calls.first().args[0] as MovedMedia[];
            expect(saved[0].id).toBe('<noId>');
        });
    });

    describe('getAllMovedMedia', () => {
        it('should return all moved media grouped by name without filter', () => {
            mockRepository.findAll.and.returnValue(mockMovieMedia);
            const sort = sortOptions[0];

            const result = service.getAllMovedMedia(sort);

            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(mockRepository.findAllByMediaNameSubstr).not.toHaveBeenCalled();
            expect(result.length).toBe(3);
        });

        it('should filter by media name when filter provided', () => {
            mockRepository.findAllByMediaNameSubstr.and.returnValue([mockMovieMedia[0]]);
            const sort = sortOptions[0];

            const result = service.getAllMovedMedia(sort, 'Alpha');

            expect(mockRepository.findAllByMediaNameSubstr).toHaveBeenCalledWith('Alpha');
            expect(mockRepository.findAll).not.toHaveBeenCalled();
            expect(result.length).toBe(1);
            expect(result[0].title).toBe('Alpha Movie');
        });

        it('should group same-name media into one entry by last occurrence', () => {
            const laterDate = new Date('2024-01-01');
            const duplicates: MovedMedia[] = [
                {...mockMovieMedia[0]},
                {...mockMovieMedia[0], id: '1-dup', date: laterDate}
            ];
            mockRepository.findAll.and.returnValue(duplicates);

            const result = service.getAllMovedMedia(sortOptions[0]);

            expect(result.length).toBe(1);
            expect(result[0].date).toEqual(laterDate);
        });

        it('should return empty array when no media', () => {
            mockRepository.findAll.and.returnValue([]);

            const result = service.getAllMovedMedia(sortOptions[0]);

            expect(result).toEqual([]);
        });

        describe('sorting', () => {
            beforeEach(() => {
                mockRepository.findAll.and.returnValue([...mockMovieMedia]);
            });

            it('should sort by title ascending', () => {
                const result = service.getAllMovedMedia(sortOptions[0]);
                expect(result[0].title).toBe('Alpha Movie');
                expect(result[1].title).toBe('Beta Movie');
                expect(result[2].title).toBe('Charlie Movie');
            });

            it('should sort by title descending', () => {
                const result = service.getAllMovedMedia(sortOptions[1]);
                expect(result[0].title).toBe('Charlie Movie');
                expect(result[1].title).toBe('Beta Movie');
                expect(result[2].title).toBe('Alpha Movie');
            });

            it('should sort by date ascending', () => {
                const result = service.getAllMovedMedia(sortOptions[2]);
                expect(result[0].date).toEqual(testDate1);
                expect(result[1].date).toEqual(testDate3);
                expect(result[2].date).toEqual(testDate2);
            });

            it('should sort by date descending', () => {
                const result = service.getAllMovedMedia(sortOptions[3]);
                expect(result[0].date).toEqual(testDate2);
                expect(result[1].date).toEqual(testDate3);
                expect(result[2].date).toEqual(testDate1);
            });
        });
    });

    describe('getMovedMedia', () => {
        it('should return a view for an existing media id', () => {
            mockRepository.findById.and.returnValue(mockMovieMedia[0]);

            const result = service.getMovedMedia('1');

            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(result).toBeDefined();
            expect(result!.id).toBe('1');
            expect(result!.title).toBe('Alpha Movie');
            expect(result!.type).toBe(MediaFileType.Movie);
            expect(result!.season).toBeUndefined();
            expect(result!.episode).toBeUndefined();
            expect(result!.posterUrl).toBe('/alpha.jpg');
            expect(result!.description).toBe('Alpha desc');
            expect(result!.cast).toEqual(['Actor1']);
            expect(result!.date).toEqual(testDate1);
        });

        it('should return undefined for non-existing id', () => {
            mockRepository.findById.and.returnValue(undefined);

            const result = service.getMovedMedia('non-existent');

            expect(result).toBeUndefined();
        });

        it('should use fallback poster when mediaDesc is missing', () => {
            mockRepository.findById.and.returnValue(mockMovieMedia[2]);

            const result = service.getMovedMedia('3');

            expect(result!.posterUrl).toBe(environment.fallbackPosterUrl);
            expect(result!.description).toBeUndefined();
            expect(result!.cast).toEqual([]);
        });

        it('should use fallback poster when posterUrl is undefined', () => {
            const mediaWithNoPoster: MovedMedia = {
                ...mockMovieMedia[0],
                mediaDesc: {posterUrl: undefined, description: 'desc', cast: ['Actor1']}
            };
            mockRepository.findById.and.returnValue(mediaWithNoPoster);

            const result = service.getMovedMedia('1');

            expect(result!.posterUrl).toBe(environment.fallbackPosterUrl);
        });
    });

    describe('getAllTVShowSeasons', () => {
        it('should return unique seasons for a TV show', () => {
            mockRepository.findAllByMediaTypeAndDateAndMediaName.and.returnValue(mockTVMedia);
            const view: MovedMediaView = {
                id: '4', type: MediaFileType.Tv,
                season: 1, episode: 1,
                posterUrl: '/tv.jpg', title: 'TV Show',
                date: testDate1, description: 'TV desc', cast: ['Actor3']
            };

            const result = service.getAllTVShowSeasons(view);

            expect(mockRepository.findAllByMediaTypeAndDateAndMediaName)
                .toHaveBeenCalledWith('TV', testDate1, 'TV Show');
            expect(result.length).toBe(2);
            const seasons = result.map(m => m.season).sort();
            expect(seasons).toEqual([1, 2]);
        });

        it('should return empty array when no media found', () => {
            mockRepository.findAllByMediaTypeAndDateAndMediaName.and.returnValue([]);
            const view: MovedMediaView = {
                id: '99', type: MediaFileType.Tv,
                season: 1, episode: 1,
                posterUrl: '', title: 'Non-existent',
                date: testDate1, description: '', cast: []
            };

            const result = service.getAllTVShowSeasons(view);

            expect(result).toEqual([]);
        });
    });

    describe('getAllTVShowEpisodes', () => {
        it('should return episodes for a given season', () => {
            const season1Media = mockTVMedia.filter(m => m.season === 1);
            mockRepository.findAllByMediaTypeAndDateAndMediaNameAndSeason.and.returnValue(season1Media);
            const view: MovedMediaView = {
                id: '4', type: MediaFileType.Tv,
                season: 1, episode: 1,
                posterUrl: '/tv.jpg', title: 'TV Show',
                date: testDate1, description: 'TV desc', cast: ['Actor3']
            };

            const result = service.getAllTVShowEpisodes(view, 1);

            expect(result.length).toBe(2);
            expect(result[0].episode).toBe(1);
            expect(result[1].episode).toBe(2);
        });

        it('should return empty array when no episodes found', () => {
            mockRepository.findAllByMediaTypeAndDateAndMediaNameAndSeason.and.returnValue([]);
            const view: MovedMediaView = {
                id: '4', type: MediaFileType.Tv,
                season: 1, episode: 1,
                posterUrl: '/tv.jpg', title: 'TV Show',
                date: testDate1, description: 'TV desc', cast: ['Actor3']
            };

            const result = service.getAllTVShowEpisodes(view, 99);

            expect(result).toEqual([]);
        });
    });

    describe('removeMovedMedia', () => {
        it('should delete media via API and remove from repository', async () => {
            const view: MovedMediaView = {
                id: '1', type: MediaFileType.Movie,
                season: undefined, episode: undefined,
                posterUrl: '/poster.jpg', title: 'Movie',
                date: testDate1, description: 'desc', cast: []
            };

            const promise = service.removeMovedMedia(view);
            const req = httpMock.expectOne(`${apiUrl}/media-moves/1`);
            expect(req.request.method).toBe('DELETE');
            expect(req.request.withCredentials).toBeTrue();
            expect(req.request.headers.get('Content-Type')).toBe('plain/text');
            req.flush(null);

            await promise;

            expect(mockRepository.removeById).toHaveBeenCalledWith('1');
        });

        it('should handle HTTP error on delete', async () => {
            const view: MovedMediaView = {
                id: '1', type: MediaFileType.Movie,
                season: undefined, episode: undefined,
                posterUrl: '/poster.jpg', title: 'Movie',
                date: testDate1, description: 'desc', cast: []
            };

            const promise = service.removeMovedMedia(view);
            const req = httpMock.expectOne(`${apiUrl}/media-moves/1`);
            req.error(new ProgressEvent('error'), {status: 500, statusText: 'Error'});

            await expectAsync(promise).toBeRejected();
            expect(mockRepository.removeById).not.toHaveBeenCalled();
        });
    });

    describe('removeMovedMediaSeason', () => {
        it('should delete all episodes of a season', async () => {
            mockRepository.findById.and.returnValue(mockTVMedia[0]);
            mockRepository.findAllByMediaTypeAndDateAndMediaNameAndSeason.and.returnValue(mockTVMedia.slice(0, 2));

            const promise = service.removeMovedMediaSeason('4');
            const req = httpMock.expectOne(`${apiUrl}/media-moves/delete-all`);
            expect(req.request.method).toBe('POST');
            expect(req.request.withCredentials).toBeTrue();
            expect(req.request.headers.get('Content-Type')).toBe('application/json');
            expect(req.request.body).toEqual(['4', '5']);
            req.flush(null);

            await promise;

            expect(mockRepository.removeById).toHaveBeenCalledWith('4');
            expect(mockRepository.removeById).toHaveBeenCalledWith('5');
        });

        it('should do nothing when media not found', async () => {
            mockRepository.findById.and.returnValue(undefined);

            await service.removeMovedMediaSeason('non-existent');

            httpMock.expectNone(`${apiUrl}/media-moves/delete-all`);
            expect(mockRepository.removeById).not.toHaveBeenCalled();
        });

        it('should POST with empty array when no media returned from repository', async () => {
            mockRepository.findById.and.returnValue(mockTVMedia[0]);
            mockRepository.findAllByMediaTypeAndDateAndMediaNameAndSeason.and.returnValue([]);

            const promise = service.removeMovedMediaSeason('4');
            const req = httpMock.expectOne(`${apiUrl}/media-moves/delete-all`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual([]);
            req.flush(null);

            await promise;

            expect(mockRepository.removeById).not.toHaveBeenCalled();
        });
    });

    describe('removeMovedMediaShow', () => {
        it('should delete all episodes of a show', async () => {
            mockRepository.findById.and.returnValue(mockTVMedia[0]);
            mockRepository.findAllByMediaTypeAndDateAndMediaName.and.returnValue(mockTVMedia);

            const promise = service.removeMovedMediaShow('4');
            const req = httpMock.expectOne(`${apiUrl}/media-moves/delete-all`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(['4', '5', '6']);
            req.flush(null);

            await promise;

            expect(mockRepository.removeById).toHaveBeenCalledWith('4');
            expect(mockRepository.removeById).toHaveBeenCalledWith('5');
            expect(mockRepository.removeById).toHaveBeenCalledWith('6');
        });

        it('should do nothing when media not found', async () => {
            mockRepository.findById.and.returnValue(undefined);

            await service.removeMovedMediaShow('non-existent');

            httpMock.expectNone(`${apiUrl}/media-moves/delete-all`);
            expect(mockRepository.removeById).not.toHaveBeenCalled();
        });

        it('should POST with empty array when no media returned from repository', async () => {
            mockRepository.findById.and.returnValue(mockTVMedia[0]);
            mockRepository.findAllByMediaTypeAndDateAndMediaName.and.returnValue([]);

            const promise = service.removeMovedMediaShow('4');
            const req = httpMock.expectOne(`${apiUrl}/media-moves/delete-all`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual([]);
            req.flush(null);

            await promise;

            expect(mockRepository.removeById).not.toHaveBeenCalled();
        });
    });

    describe('generateTitle', () => {
        it('should generate title with formatted date', () => {
            const date = new Date('2023-12-25');
            const view: MovedMediaView = {
                id: '1', type: MediaFileType.Movie,
                season: undefined, episode: undefined,
                posterUrl: '', title: 'My Movie',
                date: date, description: '', cast: []
            };

            const formatted = service.formatDate(date);
            const result = service.generateTitle(view);

            expect(result).toBe(`My Movie (${formatted})`);
        });

        it('should generate title without date when date is null', () => {
            const view: MovedMediaView = {
                id: '1', type: MediaFileType.Movie,
                season: undefined, episode: undefined,
                posterUrl: '', title: 'My Movie',
                date: null, description: '', cast: []
            };

            const result = service.generateTitle(view);

            expect(result).toBe('My Movie');
        });
    });

    describe('formatDate', () => {
        it('should format a date using configured date format', () => {
            const date = new Date('2023-01-15');
            const result = service.formatDate(date);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });

    describe('sortOptions', () => {
        it('should have the correct sort options structure', () => {
            expect(sortOptions.length).toBe(4);
            expect(sortOptions[0]).toEqual({field: 'title', direction: 'asc', label: 'sort-name-asc'});
            expect(sortOptions[1]).toEqual({field: 'title', direction: 'desc', label: 'sort-name-desc'});
            expect(sortOptions[2]).toEqual({field: 'date', direction: 'asc', label: 'sort-date-asc'});
            expect(sortOptions[3]).toEqual({field: 'date', direction: 'desc', label: 'sort-date-desc'});
        });
    });
});
