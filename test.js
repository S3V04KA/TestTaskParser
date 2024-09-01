import main from "./utils.js";
import archiver from 'archiver';
import fs from 'fs';

const urls = [
    // 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202',
    'https://www.vprok.ru/product/makfa-makfa-izd-mak-spirali-450g--306739',
]

const regions = [
    'Москва и область',
    'Санкт-Петербург и область',
    'Владимирская обл.',
    'Калужская обл.',
    'Рязанская обл.',
    'Тверская обл.',
    'Тульская обл.',
]

for (const url of urls) {
    for (const region of regions) {
        await main(url, region, 'test');

        const output = fs.createWriteStream(region+'.zip');
        const archive = archiver('zip');
        archive.pipe(output);
        archive.directory('test', false);
        archive.finalize();
    }
}