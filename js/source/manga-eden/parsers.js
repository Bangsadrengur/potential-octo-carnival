const {
  assoc,
  compose,
  curry,
  equals,
  filter,
  head,
  keys,
  map,
  pipe,
  project,
  prop,
  propEq,
  reduce,
  where,
} = require('ramda');

const renameKeys = curry((keysMap, obj) =>
  reduce(
    (acc, key) => assoc(keysMap[key] || key, obj[key], acc),
    {},
    keys(obj),
  ));

/*
 * usage: output = parseSeries(input)
 * input (comes stringified):
 *   {
 *     end: ???, Number,
 *     manga: [{
 *       a: ??? :: String,
 *       c: [ Categorie :: String],
 *       h: ??? :: Number,
 *       i: ID :: String,
 *       im : ??? :: String,
 *       ld: ??? :: Number,
 *       s: ??? Number,
 *       t: Title :: String
 *     }],
 *     page: Page number if paginated, else -1 :: Number,
 *     start: ??? :: Number,
 *     total: ??? :: Number
 *   }
 * output:
 *   [{ title: Title :: String, id: ID :: String }]
 */
const parseSeries = pipe(
  JSON.parse,
  prop('manga'),
  project(['t', 'i']),
  map(renameKeys({ t: 'title', i: 'id' })),
);

/*
 * usage: url = parseChaptersUrl(serie, input)
 * Input: input:
 *   [{ title: Title :: String }]
 * Output: url :: String
 */
const parseChaptersUrl = serie => series =>
  prop('id', head(filter(propEq('title', serie), series)));

/*
 * usage: output = parseChapters(input)
 *  input: "chapters": {
 *    "aka": [??? :: ??? ],
 *    "aka-alias": [??? :: ???],
 *    "alias": Alias :: String,
 *    "artist": Artist :: String,
 *    "artist_kw": [??? :: ???],
 *    "author": Author :: String,
 *    "author_kw": [??? :: ???],
 *    "categories": [Categories :: String]
 *    "chapters": [
 *      [
 *        Number :: Number,
 *        Time stamp :: Number,
 *        Name :: String,
 *        Path :: String
 *      ],
 *    ],
 *    "chapters_len": ??? :: Number
 *    "created": ??? :: Number
 *    "description": Description :: String,
 *    "hits": ??? :: Number,
 *    "image": Image path :: String,
 *    "language": Language 0 (english)/1 :: Number,
 *    "last_chapter_date": ??? :: Number,
 *    "random": [??? :: Number],
 *    "released": ??? :: ???,
 *    "startsWith": First letter :: String,
 *    "status": ??? :: Number,
 *    "title": Title :: String,
 *    "title_kw": [??? :: String],
 *    "type": ??? :: Number,
 *    "updatedKeywords": ??? :: Bool
 *  }
 *
 *  output:
 *    [{ number :: Number, name :: String, path :: String, date :: Number }]
 */
const epochToDate = (epoch) => {
  const date = new Date(0);
  date.setUTCSeconds(epoch);
  return date;
};

const dateToReadable = date => `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

const parseChapters = pipe(
  JSON.parse,
  prop('chapters'),
  map(([number, timestamp, name, path]) =>
    ({
      number,
      name: name || 'MISSING NAME',
      path,
      date: compose(dateToReadable, epochToDate)(timestamp),
    })),
);

/*
 * usage: chapter = selectChapter(chapterNumber)(chapters)
 * Input: input:
 *   [{
 *     number: Chapter number :: Number,
 *     name: Name :: String,
 *     path: Path :: String
 *   }]
 * Output: chapter:
 *   [{
 *     number: Chapter number :: Number,
 *     name: Name :: String,
 *     path: Path :: String
 *   }]
 *   where number === chapterNumber for all chapters in chapter and
 *   chapter.length === 1
 */
const selectChapter = pipe(
  Number,
  propEq('number'),
  filter,
);

/*
 * usage: path = chapterToChapterPath(chapter)
 * Input: chapter:
 *   [{
 *     number: Chapter number :: Number,
 *     name: Name :: String,
 *     path: Path :: String
 *   }]
 *   where chapter.length === 1
 * Output: path :: String, path === chapter[0].path
 */
const chapterToChapterPath = pipe(
  head,
  prop('path'),
);

/*
 * usage: path = pagesToPagePath(chapter)
 * Input: pages:
 *   [{
 *     number: Page number :: Number,
 *     path: Path :: String,
 *     height: Height :: Number,
 *     width: Width :: Number,
 *   }]
 * Output: path :: String
 */
const pagesToPagePath = number =>
  compose(
    prop('path'),
    head,
    filter(where({ number: equals(number) })),
  );

module.exports = {
  parseSeries,
  parseChaptersUrl,
  parseChapters,
  chapterToChapterPath,
  selectChapter,
  pagesToPagePath,
};
