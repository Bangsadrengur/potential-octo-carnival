const test = require('ava');
const { series: SERIES, chapters } = require('./fixtures/example-data');
const {
  parseSeries,
  parseChaptersUrl,
  parseChapters,
  chapterToChapterPath,
  selectChapter,
  pagesToPagePath,
} = require('../backend/domain/manga-eden/parsers');

test('parseSeries', (t) => {
  const output = parseSeries(JSON.stringify(SERIES));

  t.deepEqual(output, [
    { title: 'Flower Dream', id: '5372389645b9ef5a0b1d20d8' },
    { title: 'Kanai-kun', id: '54430be945b9ef3a6d5818cc' },
  ]);
});

test('parseChaptersUrl', (t) => {
  const series = [
    { title: 'Flower Dream', id: '5372389645b9ef5a0b1d20d8' },
    { title: 'Kanai-kun', id: '54430be945b9ef3a6d5818cc' },
  ];
  const output = parseChaptersUrl('Flower Dream')(series);

  t.is(output, '5372389645b9ef5a0b1d20d8');
});

test('parseChapters', (t) => {
  const output = parseChapters(JSON.stringify(chapters));

  t.deepEqual(output, [
    { date: '3/5/2010', number: 5, name: '5', path: '4e711cb0c09225616d037cc2' },
    { date: '3/5/2010', number: 4, name: '4', path: '4e711cb1c09225616d037ce4' },
    { date: '3/5/2010', number: 3, name: '3', path: '4e711cacc09225616d037c72' },
    { date: '3/5/2010', number: 2, name: '2', path: '4e711cb3c09225616d037d05' },
    { date: '3/5/2010', number: 1, name: '1', path: '4e711caec09225616d037ca0' },
  ]);
});

test('selectChapter', (t) => {
  const parsedChapters = [
    { number: 5, name: '5', path: '4e711cb0c09225616d037cc2' },
    { number: 4, name: '4', path: '4e711cb1c09225616d037ce4' },
    { number: 3, name: '3', path: '4e711cacc09225616d037c72' },
    { number: 2, name: '2', path: '4e711cb3c09225616d037d05' },
    { number: 1, name: '1', path: '4e711caec09225616d037ca0' },
  ];
  const output = selectChapter(2)(parsedChapters);

  t.deepEqual(
    output,
    [{ number: 2, name: '2', path: '4e711cb3c09225616d037d05' }],
  );
});

test('chapterToChapterPath', (t) => {
  const parsedChapter = [
    { number: 4, name: '4', path: '4e711cb1c09225616d037ce4' },
  ];
  const output = chapterToChapterPath(parsedChapter);

  t.deepEqual(output, '4e711cb1c09225616d037ce4');
});

test('pagesToPagePath', (t) => {
  const pages = [
    { number: 1, path: 'path-1.jpg', height: 1800, width: 1108 },
    { number: 2, path: 'path-2.jpg', height: 800, width: 1000 },
  ];
  const output = pagesToPagePath(1)(pages);

  t.deepEqual(output, 'path-1.jpg');
});
