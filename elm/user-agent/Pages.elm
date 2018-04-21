module Page exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Navigation
import UrlParser exposing ((</>), s, int, string, map, parsePath, Parser)
import Json.Decode as Decode
import Http

main =
  Navigation.program UrlChange
  { init = init
  , view = view
  , update = update
  , subscriptions = subscriptions
  }

-- Model

type alias Model =
  { page : Page
  , lastPage : Int
  }

type alias Page = { serie : String, chapter : Int, page : Int }

rawPage : Parser (String -> Int -> Int -> a) a
rawPage =
  UrlParser.s "browse" </> UrlParser.s "series" </> string </> UrlParser.s "chapters" </> int </> UrlParser.s "pages" </> int

page : Parser (Page -> a) a
page = UrlParser.map Page rawPage

readPage : Maybe Page -> Page
readPage page =
  case page of
    Nothing -> Page "" -2 -2
    Just valid -> valid

locationToPage : Navigation.Location -> Page
locationToPage location = readPage (parsePath page location)

init : Navigation.Location -> (Model, Cmd Msg)
init location =
  let page = (locationToPage location)
  in (Model page page.page, getPageCount page)

-- Update

type Msg
  = UrlChange Navigation.Location |
    LoadPageCount (Result Http.Error Int)

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    UrlChange location ->
      (Model (locationToPage location) -2, Cmd.none
      )
    LoadPageCount (Ok count) ->
        (Model model.page count, Cmd.none)
    LoadPageCount (Err error) ->
      (model, Cmd.none)

-- View

prefetch : String -> String -> Int -> Html msg
prefetch serie chapter index =
  div []
  [ node "link"
    [ rel "prefetch"
    , href <| "/browse/series/" ++ serie ++ "/chapters/" ++ chapter ++ "/pages/" ++ (toString index)
    ] []
  , node "link"
    [ rel "prefetch"
    , href <| "/api/series/" ++ serie ++ "/chapters/" ++ chapter ++ "/pages/" ++ (toString index)
    ] []
  ]


prefetchAll : String -> Int -> Int -> Int -> Html msg
prefetchAll serie chapter current count =
  div [] (List.map (prefetch serie (toString chapter)) (List.range (current + 1) count))

view : Model -> Html Msg
view model =
  let
    this = "/api/series/" ++ model.page.serie ++ "/chapters/" ++ (toString model.page.chapter) ++ "/pages/" ++ (toString (model.page.page))
    next =
      case model.page.page == model.lastPage of
        True -> "/"
        _ -> "/browse/series/" ++ model.page.serie ++ "/chapters/" ++ (toString model.page.chapter) ++ "/pages/" ++ (toString (model.page.page + 1))
    pref =
      case model.page.page == 1 of
        True -> (prefetchAll model.page.serie model.page.chapter model.page.page model.lastPage)
        _ -> div [] []
  in
    div []
    [ a [ href next ] [ img [ src this , style [ ("width", "100%"), ("height", "auto") ] ] [] ]
    , pref
    ]

-- Subscriptions

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none

-- Http

decodePageCount : Decode.Decoder Int
decodePageCount = Decode.field "count" Decode.int

getPageCount : Page -> Cmd Msg
getPageCount page =
  let
      url = "/api/series/" ++ page.serie ++ "/chapters/" ++ (toString page.chapter) ++ "/pages"
  in
      Http.send LoadPageCount (Http.get url decodePageCount)
