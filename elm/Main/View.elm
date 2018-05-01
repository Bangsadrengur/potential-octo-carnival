module Main.View exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import List exposing (head, map)

import Types exposing(Chapter, Series, Serie, Model, Msg)

formatChapter : (Chapter, String) -> Html msg
formatChapter (chapter, serieUrlName) =
  let
    number = toString chapter.number
  in
    li []
      [ a [ href <| "/browse/series/" ++ serieUrlName ++ "/chapters/" ++ number ++ "/pages/1" ]
        [ text (number ++ " - " ++ chapter.name ++ " - " ++ chapter.date)
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
    Nothing -> Chapter "failed" -1 "failed"
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
