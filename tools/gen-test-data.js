/**
 * generate csv data for artillery to use when testing the api
 * see tests/load.yaml
 */

const uuid = require('uuid');

const number = process.argv[2];

const names = ['tim', 'frank', 'horatio', 'milly', 'mary', 'davina', 'jon', 'henrietta', 'thomas', 'zoro'];
const domains = ['gmail.com', 'ms.com', 'dofus.net', 'gov.org', 'amazon.com', 'evil-empire.co.uk'];

console.log('id,email,number');

for(i = 0; i < number; i++) {
    var num = Math.floor((Math.random() * 100000 ) + 1);
    var email = names[i % 10] + '-' + Math.floor((Math.random() * 100 )) + '@' + domains[i % 6];
    console.log(uuid.v4() + ',' + email + ',' + num);
}
