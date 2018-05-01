module Main exposing(..)

import Html exposing (program)

import Main.View exposing (view)
import Main.Update exposing (update)
import Main.Init exposing (init)
import Main.Subscriptions exposing (subscriptions)
import Types exposing (Model, Msg)

main = 
  Html.program
  { init = init
  , view = view
  , update = update
  , subscriptions = subscriptions
  }
