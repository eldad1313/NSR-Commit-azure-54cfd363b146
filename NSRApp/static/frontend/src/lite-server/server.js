var sa = require('superagent');

function post(data) {

    sa.post('https://gps-qa.maytronics.co/location/')
        .send(data)
        .end(function (err, res) { });
}

var pos = {
    longitude: 23,
    latitude: 24
}

var techs = [
    { id: 1, name: 'Slava Horesh', team: 4, tName: 'Azure' },
    { id: 2, name: 'Nir Krevner', team: 4, tName: 'Azure' },
    { id: 3, name: 'Noga Hendler', team: 4, tName: 'Azure' },
    { id: 4, name: 'Aharon Kreitenberger', team: 1, tName: 'Lemon' },
    { id: 5, name: 'Ahuvi Yearim', team: 1, tName: 'Lemon' },
    { id: 6, name: 'Yuval Hasefel', team: 1, tName: 'Lemon' },
    { id: 7, name: 'Adi Raz', team: 1, tName: 'Lemon' },
    { id: 8, name: 'Alex Kolesnichenko', team: 2, tName: 'Indigo' },
    { id: 9, name: 'Ronen Mintz', team: 2, tName: 'Indigo' },
    { id: 10, name: 'Nadav Efrati', team: 2, tName: 'Indigo' },
    { id: 11, name: 'Dorin ben-tovim', team: 3, tName: 'Pink' },
    { id: 12, name: 'Alon Tam', team: 3, tName: 'Pink' },
    { id: 13, name: 'Alex Snitkovsky', team: 3, tName: 'Pink' },
    { id: 14, name: 'Galit Trosman', team: 3, tName: 'Pink' }
];

setInterval(() => {

    techs.forEach(t => {
        post({
            "teamId": t.team,
            "latitude": 34 + Math.random(),
            "fullName": t.name,
            "longitude": 23 + Math.random(),
            "userId": t.id,
            "serviceCompanyId": 1,
            "teamName": t.tName
        });
        console.log('exec', t.name);
    });

}, 2000)

