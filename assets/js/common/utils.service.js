angular.module('app').factory('UtilsService', ['$http', function ($http) {
    return {
        encodeCronJob(fromHour, fromMinute, fromDaylightSaving, toHour, toMinute, toDaylightSaving, frequency) {
            fromHour = fromHour + (fromDaylightSaving * 12) % 24;
            toHour = toHour + (toDaylightSaving * 12) % 24;
            if (fromHour == toHour)
                return [`${fromMinute}-${toMinute}/${frequency} ${fromHour} * * *`]
            // There would be three crons
            let crons = [];
            // First cron would be from first hour of the end of first hour
            crons.push(`${fromMinute}-59/${frequency} ${fromHour} * * *`)
            if((toHour - fromHour) > 2)
                crons.push(`*/${frequency} ${fromHour+1}-${toHour-1} * * *`)
            crons.push(`0-${toMinute}/${frequency} ${toHour} * * *`)
            return crons;
        }
    }
}]);