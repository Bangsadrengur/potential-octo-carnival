const test = require('ava');
const { series, chapters, pages } = require('./fixtures/example-data');
const {
  parseSeries,
  parseChaptersUrl,
  parseChapters,
  chapterToChapterPath,
  selectChapter,
} = require('../lib/source/parsers');

test('parseSeries', t => {
  const output = parseSeries(JSON.stringify(series));

  t.deepEqual(output, [
    { title: "Flower Dream", id: "5372389645b9ef5a0b1d20d8" },
    { title: "Kanai-kun", id: "54430be945b9ef3a6d5818cc" }
  ])
});

test('parseChaptersUrl', t => {
  const series = [
    { title: "Flower Dream", id: "5372389645b9ef5a0b1d20d8" },
    { title: "Kanai-kun", id: "54430be945b9ef3a6d5818cc" }
  ];
  const output = parseChaptersUrl('Flower Dream')(series);

  t.is(output, '5372389645b9ef5a0b1d20d8');
});

test('parseChapters', t => {
  const output = parseChapters(JSON.stringify(chapters));

  t.deepEqual(output, [
    { number: 5, name: '5', path: '4e711cb0c09225616d037cc2' },
    { number: 4, name: '4', path: '4e711cb1c09225616d037ce4' },
    { number: 3, name: '3', path: '4e711cacc09225616d037c72' },
    { number: 2, name: '2', path: '4e711cb3c09225616d037d05' },
    { number: 1, name: '1', path: '4e711caec09225616d037ca0' },
  ])
});

test('selectChapter', t => {
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
    [{ number: 2, name: '2', path: '4e711cb3c09225616d037d05' }]
  );
});

test('chapterToChapterPath', t => {
  const parsedChapter = [
    { number: 4, name: '4', path: '4e711cb1c09225616d037ce4' },
  ];
  const output = chapterToChapterPath(parsedChapter);

  t.deepEqual(output, '4e711cb1c09225616d037ce4');
});
