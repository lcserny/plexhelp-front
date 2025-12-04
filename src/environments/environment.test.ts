export const environment = {
    commanderApiUrl: 'http://localhost:9999/api/v1',
    securityApiUrl: 'http://localhost:9998/security',

    fallbackPosterUrl: "/assets/img/no-poster.jpg",

    pageSizeOptions: {
        usersList: [5, 10, 25, 100],
        mediaSearch: [10, 20, 50],
        magnets: [10, 20, 50],
        downloads: [10, 20, 50, 100]
    },

    region: {
        dateFormat: "dd.MM.yyyy",
        timeFormat: "HH:mm:ss",
        timezone: "Europe/Bucharest",
        locale: "ro",
        firstDayWeek: 1
    }
};
