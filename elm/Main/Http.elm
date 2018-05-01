module Main.Http exposing (getSeries)

import Http
import Json.Decode as Decode
import Types exposing (Msg, Chapters, Chapter)

decodeChapter : Decode.Decoder Types.Chapter
decodeChapter =
  Decode.map3
    Types.Chapter
    (Decode.field "name" Decode.string)
    (Decode.field "number" Decode.int)
    (Decode.field "date" Decode.string)

decodeChapters : Decode.Decoder Types.Chapters
decodeChapters = Decode.list decodeChapter

getCommand : String -> (Result Http.Error Types.Chapters -> Msg)
getCommand serie = Types.LoadChapters serie

getReq : String -> Http.Request Types.Chapters
getReq url = Http.get url decodeChapters

getSerie : String -> Cmd Msg
getSerie serie =
  let
    url = "/api/series/" ++ serie ++ "/chapters/limit/5"
    command = getCommand serie
    req = getReq url
  in
    Http.send command req

getSeries : Cmd Msg
getSeries =
  getSerie "one-piece"
