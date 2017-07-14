module Main exposing(..)

import Html exposing (..)
import Html.Attributes exposing (..)
import List exposing (..)
import Http
import Json.Decode as Decode
import Debug exposing (..)

type alias Chapter =
  { name : String
  , number : String
  , date : String
  , pageCount : Int
  }
type alias Serie =
  { name : String
  , urlName : String
  , chapters : List Chapter
  }
type alias Series = List Serie

main = 
  Html.program
  { init = init
  , view = view
  , update = update
  , subscriptions = subscriptions
  }

-- Model

type alias Model = { series : Series }

init : (Model, Cmd Msg)
init =
  ({ series =
    [ { name = "init serie name"
      , urlName = "init urlName"
      , chapters =
        [ { name = "init name"
        , number = "init number"
        , date = "init date"
        , pageCount = -1
        }
        ]
      }
    ]
  }
  , getSeries
  )

-- Update

type Msg
  = LoadSeries (Result Http.Error Series)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    LoadSeries (Ok series) ->
      case series of
        [] -> (model, Cmd.none)
        _ -> (Model series, Cmd.none)
    LoadSeries (Err error) ->
      (model, Cmd.none)

-- View

formatChapter : (Chapter, String) -> Html msg
formatChapter (chapter, serieUrlName) =
  li []
    [ a [ href <| "/browse/series/" ++ serieUrlName ++ "/chapters/" ++ chapter.number ++ "/pages/1" ]
      [ text (chapter.number ++ " - " ++ chapter.name ++ " - " ++ chapter.date)
      ]
    ]
formatChapters : Serie -> List (Html msg)
formatChapters serie = List.map formatChapter
  (List.map (\chapter -> (chapter, serie.urlName)) serie.chapters)
formatSerie : Serie -> Html msg
formatSerie serie = div []
  [ h2 [] [ text (.name serie) ]
  , ul [] (formatChapters serie)
  ]
formatSeries : List Serie -> Html msg
formatSeries series = div [] (List.map formatSerie series)

readChapter : Maybe Chapter -> Chapter
readChapter chapter =
  case chapter of
    Nothing -> Chapter "failed" "failed" "failed" -2
    Just chapter -> chapter

readSerie : Maybe Serie -> Serie
readSerie serie =
  case serie of
    Nothing -> Serie "failed" "failed" []
    Just serie -> serie

getSerie : Series -> Serie
getSerie series = readSerie (head series)

getChapter : List Chapter -> Chapter
getChapter chapters = readChapter (head chapters)

view : Model -> Html Msg
view model =
  body []
  [ h1 [] [ text "Manga Now (sh)"]
  , formatSeries model.series
  ]

-- Subscriptions

subscriptions : Model -> Sub Msg
subscriptions model = Sub.none

-- Http

decodeChapter : Decode.Decoder Chapter
decodeChapter =
  Decode.map4 Chapter
    (Decode.field "name" Decode.string)
    (Decode.field "number" Decode.string)
    (Decode.field "date" Decode.string)
    (Decode.field "pageCount" Decode.int)

decodeSerie : Decode.Decoder Serie
decodeSerie =
  Decode.map3
  Serie
  (Decode.field "name" Decode.string)
  (Decode.field "urlName" Decode.string)
  (Decode.field "chapters" (Decode.list decodeChapter))

decodeSeries : Decode.Decoder Series
decodeSeries = Decode.list decodeSerie

getSeries : Cmd Msg
getSeries =
  let url = "/api/series" in Http.send LoadSeries (Http.get url decodeSeries)
