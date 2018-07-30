module Main.Init exposing (init)

import Main.Http exposing (getSeries)
import Types exposing (Model, Msg)

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
