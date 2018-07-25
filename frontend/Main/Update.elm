module Main.Update exposing (update)

import String.Case exposing (toKebabCaseUpper)

import Types exposing (Model, Msg)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Types.LoadChapters serie (Ok chapters) ->
      case chapters of
        [] -> (model, Cmd.none)
        _ -> (Model [{ name = serie
                     , urlName = String.Case.toKebabCaseLower serie
                     , chapters = chapters
                     }]
              , Cmd.none)
    Types.LoadChapters serie (Err error) ->
      (model, Cmd.none)

