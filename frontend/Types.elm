module Types exposing (..)

import Http exposing (Error)

type alias Chapter =
  { name : String
  , number : Int
  , date : String
  }

type alias Chapters = List Chapter

type alias Serie =
  { name : String
  , urlName : String
  , chapters : Chapters
  }

type alias Series = List Serie

type alias Model = { series : Series }

type Msg
  = LoadChapters String (Result Http.Error Chapters)
