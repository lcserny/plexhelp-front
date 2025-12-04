const currentDomain = `${window.location.protocol}//${window.location.hostname}`;

export const environment = {
    commanderApiUrl: `${currentDomain}:8080/api/v1`,
    securityApiUrl: `${currentDomain}:8081/security`,

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
