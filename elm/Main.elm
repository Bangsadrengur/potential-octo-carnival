module Main exposing(..)

import Http
import Json.Decode as Decode
import Debug exposing (..)
import String.Case exposing (toKebabCaseUpper)
import Html exposing (program)
import Debug exposing (..)

import Main.View exposing (view)
import Types exposing (..)

main = 
  Html.program
  { init = init
  , view = view
  , update = update
  , subscriptions = subscriptions
  }

-- Model


init : (Model, Cmd Msg)
init =
  ({ series =
    [ { name = "One Piece"
      , urlName = "one-piece"
      , chapters = []
      }
    , { name = "One-Punch Man"
      , urlName = "onepunch-man"
      , chapters = []
      }
    ]
  }
  , getSeries
  )

-- Update

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    LoadChapters serie (Ok chapters) ->
      case chapters of
        [] -> (model, Cmd.none)
        _ -> (Model [{ name = serie
                     , urlName = String.Case.toKebabCaseLower serie
                     , chapters = chapters
                     }]
              , Cmd.none)
    LoadChapters serie (Err error) ->
      let stuff = log "ERROR" error
      in
      (model, Cmd.none)

-- Subscriptions

subscriptions : Model -> Sub Msg
subscriptions model = Sub.none

-- Http

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
getCommand serie = LoadChapters serie

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
